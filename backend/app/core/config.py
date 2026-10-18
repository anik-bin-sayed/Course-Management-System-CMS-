from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"

    APP_NAME: str
    APP_VERSION: str

    DATABASE_URL: str

    SECRET_KEY: str

    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    SMTP_PASSWORD: str
    SMTP_GMAIL: str

    SSLCOMMERZ_STORE_ID: str
    SSLCOMMERZ_STORE_PASSWORD: str

    SSLCOMMERZ_IS_SANDBOX: bool = True

    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"

    REDIS_URL: str

    @property
    def SSLCOMMERZ_INIT_URL(self) -> str:
        if self.SSLCOMMERZ_IS_SANDBOX:
            return "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"

        return "https://securepay.sslcommerz.com/gwprocess/v4/api.php"

    @property
    def SSLCOMMERZ_VALIDATION_URL(self) -> str:
        if self.SSLCOMMERZ_IS_SANDBOX:
            return (
                "https://sandbox.sslcommerz.com/"
                "validator/api/validationserverAPI.php"
            )

        return (
            "https://securepay.sslcommerz.com/" "validator/api/validationserverAPI.php"
        )

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
