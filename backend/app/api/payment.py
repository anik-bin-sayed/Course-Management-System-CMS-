from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.dependencies.database import get_db

from app.schemas.payment import (
    PaymentCreate,
    PaymentResponse,
)
from app.services.payment import PaymentService
from app.schemas.payment import PaymentInitiateResponse
from app.repositories.payment import PaymentRepository
from app.core.dependencies import (
    student_required,
)
from app.core.config import settings

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


def payment_result_redirect(result: str, payment_id: int | None = None):
    url = f"{settings.FRONTEND_URL.rstrip('/')}/dashboard?payment={result}"
    if payment_id is not None:
        url += f"&payment_id={payment_id}"
    return RedirectResponse(url=url, status_code=status.HTTP_303_SEE_OTHER)


@router.post(
    "",
    response_model=PaymentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(student_required),
):

    payment = PaymentService.create(
        db=db,
        student_id=current_user.id,
        enrollment_id=data.enrollment_id,
    )

    return payment


@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(student_required),
):

    from fastapi import HTTPException

    from app.repositories.payment import PaymentRepository
    from app.repositories.enrollment import EnrollmentRepository

    payment = PaymentRepository.get_by_id(
        db=db,
        payment_id=payment_id,
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    enrollment = EnrollmentRepository.get_by_id(
        db=db,
        enrollment_id=payment.enrollment_id,
    )

    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail="Enrollment not found",
        )

    if enrollment.student_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot access this payment",
        )

    return payment


@router.post(
    "/{payment_id}/initiate",
    response_model=PaymentInitiateResponse,
)
async def initiate_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(student_required),
):
    return await PaymentService.initiate_sslcommerz_payment(
        db=db,
        payment_id=payment_id,
        current_user=current_user,
    )


@router.post("/sslcommerz/ipn")
async def sslcommerz_ipn(
    request: Request,
    db: Session = Depends(get_db),
):
    form_data = await request.form()

    gateway_status = form_data.get("status")
    tran_id = form_data.get("tran_id")
    val_id = form_data.get("val_id")

    if not tran_id:
        return {
            "status": "FAILED",
            "message": "Transaction ID missing",
        }

    # FAILED
    if gateway_status == "FAILED":

        payment = PaymentRepository.get_by_transaction_id(
            db,
            tran_id,
        )

        if payment:
            PaymentService.mark_failed(
                db,
                payment.id,
            )

        return {
            "status": "FAILED",
            "payment_id": payment.id if payment else None,
        }

    # CANCELLED
    if gateway_status == "CANCELLED":

        payment = PaymentRepository.get_by_transaction_id(
            db,
            tran_id,
        )

        if payment:
            PaymentService.mark_cancelled(
                db,
                payment.id,
            )

        return {
            "status": "CANCELLED",
            "payment_id": payment.id if payment else None,
        }

    # SUCCESS / VALID
    if gateway_status == "VALID":

        if not val_id:
            return {
                "status": "FAILED",
                "message": "Validation ID missing",
            }

        payment = await PaymentService.validate_sslcommerz_payment(
            db=db,
            tran_id=tran_id,
            val_id=val_id,
        )

        return {
            "status": "SUCCESS",
            "payment_id": payment.id,
        }

    return {
        "status": "RECEIVED",
        "gateway_status": gateway_status,
    }


@router.post("/sslcommerz/success")
async def sslcommerz_success(
    request: Request,
    db: Session = Depends(get_db),
):
    form_data = await request.form()

    tran_id = form_data.get("tran_id")
    val_id = form_data.get("val_id")

    if not tran_id or not val_id:
        return {
            "status": "FAILED",
            "message": "Invalid payment callback",
        }

    payment = await PaymentService.validate_sslcommerz_payment(
        db=db,
        tran_id=tran_id,
        val_id=val_id,
    )

    return payment_result_redirect("success", payment.id)


@router.post("/sslcommerz/fail")
async def sslcommerz_fail(
    request: Request,
    db: Session = Depends(get_db),
):
    form_data = await request.form()

    tran_id = form_data.get("tran_id")

    if tran_id:

        payment = PaymentRepository.get_by_transaction_id(
            db,
            tran_id,
        )

        if payment:
            PaymentService.mark_failed(
                db,
                payment.id,
            )

    return payment_result_redirect("failed")


@router.post("/sslcommerz/cancel")
async def sslcommerz_cancel(
    request: Request,
    db: Session = Depends(get_db),
):
    form_data = await request.form()

    tran_id = form_data.get("tran_id")

    if tran_id:

        payment = PaymentRepository.get_by_transaction_id(
            db,
            tran_id,
        )

        if payment:
            PaymentService.mark_cancelled(
                db,
                payment.id,
            )

    return payment_result_redirect("cancelled")
