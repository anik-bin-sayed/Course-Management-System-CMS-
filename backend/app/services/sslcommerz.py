import httpx

from app.core.config import settings


class SSLCommerzService:

    @staticmethod
    async def initiate_payment(
        *,
        tran_id: str,
        amount: str,
        cus_name: str,
        cus_email: str,
        cus_phone: str,
        course_name: str,
    ):
        backend_url = settings.BACKEND_URL.rstrip("/")
        payload = {
            "store_id": settings.SSLCOMMERZ_STORE_ID,
            "store_passwd": settings.SSLCOMMERZ_STORE_PASSWORD,
            "total_amount": amount,
            "currency": "BDT",
            "tran_id": tran_id,
            "success_url": (f"{backend_url}" "/api/payments/sslcommerz/success"),
            "fail_url": (f"{backend_url}" "/api/payments/sslcommerz/fail"),
            "cancel_url": (f"{backend_url}" "/api/payments/sslcommerz/cancel"),
            "ipn_url": (f"{backend_url}" "/api/payments/sslcommerz/ipn"),
            "cus_name": cus_name,
            "cus_email": cus_email,
            "cus_phone": cus_phone,
            "cus_add1": "Dhaka",
            "cus_city": "Dhaka",
            "cus_postcode": "1000",
            "cus_country": "Bangladesh",
            "shipping_method": "NO",
            "num_of_item": 1,
            "product_name": course_name,
            "product_category": "Course",
            "product_profile": "general",
            "value_a": tran_id,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                settings.SSLCOMMERZ_INIT_URL,
                data=payload,
            )

        response.raise_for_status()

        return response.json()

    @staticmethod
    async def validate_payment(
        val_id: str,
    ):
        params = {
            "val_id": val_id,
            "store_id": settings.SSLCOMMERZ_STORE_ID,
            "store_passwd": settings.SSLCOMMERZ_STORE_PASSWORD,
            "format": "json",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                settings.SSLCOMMERZ_VALIDATION_URL,
                params=params,
            )

        response.raise_for_status()

        return response.json()
