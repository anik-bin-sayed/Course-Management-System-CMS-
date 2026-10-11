import uuid
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.course import Course
from app.models.enrollment import EnrollmentStatus
from app.models.payment import PaymentStatus
from app.repositories.enrollment_repository import EnrollmentRepository
from app.repositories.payment import PaymentRepository
from app.services.enrollment_service import EnrollmentService
from app.services.sslcommerz import SSLCommerzService


def generate_transaction_id(payment_id: int) -> str:
    unique_part = uuid.uuid4().hex[:12].upper()

    return f"COURSE_{payment_id}_{unique_part}"


class PaymentService:

    @staticmethod
    def calculate_course_price(course: Course) -> Decimal:

        if course.course_type.value == "free":
            return Decimal("0.00")

        if course.discount_price is not None:
            if course.discount_price > 0:
                return Decimal(str(course.discount_price))

        return Decimal(str(course.price))

    @staticmethod
    def create(
        db: Session,
        student_id: str,
        enrollment_id: int,
    ):
        enrollment = EnrollmentRepository.get_by_id(
            db=db,
            enrollment_id=enrollment_id,
        )

        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Enrollment not found",
            )

        if enrollment.student_id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot create payment for this enrollment",
            )

        if enrollment.status == EnrollmentStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This course is already active",
            )

        course = db.query(Course).filter(Course.id == enrollment.course_id).first()

        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )

        # --------------------------------
        # Check course type
        # --------------------------------

        course_type = (
            course.course_type.value
            if hasattr(course.course_type, "value")
            else str(course.course_type)
        )

        # --------------------------------
        # FREE COURSE
        # --------------------------------

        if course_type == "free":

            EnrollmentService.activate(
                db=db,
                enrollment=enrollment,
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This is a free course. No payment is required.",
            )

        # --------------------------------
        # Existing payment
        # --------------------------------

        existing_payment = PaymentRepository.get_by_enrollment(
            db=db,
            enrollment_id=enrollment.id,
        )

        if existing_payment:

            if existing_payment.status == PaymentStatus.SUCCESS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This payment has already been completed",
                )

            if existing_payment.status == PaymentStatus.PENDING:
                return existing_payment

            # FAILED / CANCELLED
            # Existing payment আবার pending করা হবে

            existing_payment.status = PaymentStatus.PENDING
            existing_payment.transaction_id = None
            existing_payment.paid_at = None

            db.commit()
            db.refresh(existing_payment)

            return existing_payment

        # --------------------------------
        # Calculate amount
        # --------------------------------

        amount = PaymentService.calculate_course_price(course)

        if amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid course price",
            )

        # --------------------------------
        # Create payment
        # --------------------------------

        payment = PaymentRepository.create(
            db=db,
            enrollment_id=enrollment.id,
            amount=amount,
        )

        return payment

    @staticmethod
    def mark_success(
        db: Session,
        payment_id: int,
        transaction_id: str,
    ):

        # --------------------------------
        # Get payment
        # --------------------------------

        payment = PaymentRepository.get_by_id(
            db=db,
            payment_id=payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found",
            )

        # --------------------------------
        # Already successful
        # --------------------------------

        if payment.status == PaymentStatus.SUCCESS:
            return payment

        # --------------------------------
        # Transaction ID duplicate check
        # --------------------------------

        existing_transaction = PaymentRepository.get_by_transaction_id(
            db=db,
            transaction_id=transaction_id,
        )

        if existing_transaction and existing_transaction.id != payment.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Transaction ID already used",
            )

        # --------------------------------
        # Mark payment successful
        # --------------------------------

        payment = PaymentRepository.mark_success(
            db=db,
            payment=payment,
            transaction_id=transaction_id,
        )

        # --------------------------------
        # Activate enrollment
        # --------------------------------

        enrollment = EnrollmentRepository.get_by_id(
            db=db,
            enrollment_id=payment.enrollment_id,
        )

        if enrollment:
            EnrollmentService.activate(
                db=db,
                enrollment=enrollment,
            )

        return payment

    @staticmethod
    def mark_failed(
        db: Session,
        payment_id: int,
    ):

        payment = PaymentRepository.get_by_id(
            db=db,
            payment_id=payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found",
            )

        if payment.status == PaymentStatus.SUCCESS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Successful payment cannot be marked as failed",
            )

        return PaymentRepository.mark_failed(
            db=db,
            payment=payment,
        )

    @staticmethod
    def mark_cancelled(
        db: Session,
        payment_id: int,
    ):

        payment = PaymentRepository.get_by_id(
            db=db,
            payment_id=payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found",
            )

        if payment.status == PaymentStatus.SUCCESS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Successful payment cannot be cancelled",
            )

        return PaymentRepository.mark_cancelled(
            db=db,
            payment=payment,
        )

    @staticmethod
    async def initiate_sslcommerz_payment(
        db: Session,
        payment_id: int,
        current_user,
    ):
        # --------------------------------
        # Get payment
        # --------------------------------

        payment = PaymentRepository.get_by_id(
            db=db,
            payment_id=payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found",
            )

        # --------------------------------
        # Get enrollment
        # --------------------------------

        enrollment = payment.enrollment

        # --------------------------------
        # Security check
        # --------------------------------

        if enrollment.student_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to pay for this enrollment",
            )

        # --------------------------------
        # Check payment status
        # --------------------------------

        if payment.status != PaymentStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This payment is not pending",
            )

        # --------------------------------
        # Get course
        # --------------------------------

        course = enrollment.course

        # --------------------------------
        # Generate transaction ID
        # --------------------------------

        transaction_id = generate_transaction_id(payment.id)

        payment.transaction_id = transaction_id

        db.commit()
        db.refresh(payment)

        # --------------------------------
        # Initialize SSLCommerz payment
        # --------------------------------

        gateway_response = await SSLCommerzService.initiate_payment(
            tran_id=transaction_id,
            amount=str(payment.amount),
            cus_name=current_user.name,
            cus_email=current_user.email,
            cus_phone=getattr(
                current_user,
                "phone",
                "",
            )
            or "01700000000",
            course_name=course.title,
        )

        # --------------------------------
        # Check gateway response
        # --------------------------------

        if gateway_response.get("status") != "SUCCESS":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=gateway_response.get(
                    "failedreason",
                    "Failed to initialize SSLCOMMERZ payment",
                ),
            )

        # --------------------------------
        # Get gateway URL
        # --------------------------------

        gateway_url = gateway_response.get("GatewayPageURL")

        if not gateway_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="SSLCOMMERZ GatewayPageURL not found",
            )

        # --------------------------------
        # Return payment information
        # --------------------------------

        return {
            "payment_id": payment.id,
            "transaction_id": transaction_id,
            "amount": str(payment.amount),
            "gateway_url": gateway_url,
        }

    @staticmethod
    async def validate_sslcommerz_payment(
        db: Session,
        tran_id: str,
        val_id: str,
    ):
        payment = PaymentRepository.get_by_transaction_id(
            db,
            tran_id,
        )

        if not payment:
            raise HTTPException(
                status_code=404,
                detail="Payment not found for this transaction",
            )

        # Already successful
        if payment.status == PaymentStatus.SUCCESS:
            return payment

        validation_response = await SSLCommerzService.validate_payment(val_id)

        validation_status = validation_response.get("status")

        # SSLCommerz status check
        if validation_status not in {
            "VALID",
            "VALIDATED",
        }:
            raise HTTPException(
                status_code=400,
                detail=("SSLCOMMERZ payment validation failed"),
            )

        validated_tran_id = validation_response.get("tran_id")

        validated_amount = validation_response.get("amount")

        validated_currency = validation_response.get("currency")

        # Transaction ID check
        if validated_tran_id != payment.transaction_id:
            raise HTTPException(
                status_code=400,
                detail="Transaction ID mismatch",
            )

        # Amount check
        if validated_amount is None:
            raise HTTPException(
                status_code=400,
                detail="Validation response amount missing",
            )

        if Decimal(str(validated_amount)) != Decimal(str(payment.amount)):
            raise HTTPException(
                status_code=400,
                detail="Payment amount mismatch",
            )

        # Currency check
        if validated_currency != "BDT":
            raise HTTPException(
                status_code=400,
                detail="Payment currency mismatch",
            )

        # Mark payment success
        PaymentRepository.mark_success(
            db=db,
            payment=payment,
            transaction_id=payment.transaction_id,
        )

        # Activate enrollment
        EnrollmentService.activate(
            db=db,
            enrollment=payment.enrollment,
        )

        return payment
