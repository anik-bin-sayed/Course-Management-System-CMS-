from datetime import datetime, date

from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class CheckEmailSchema(BaseModel):
    email: EmailStr


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class UserResponse(BaseModel):
    id: str

    name: str
    email: EmailStr

    phone: str | None = None
    avatar: str | None = None
    bio: str | None = None

    gender: str | None = None

    date_of_birth: date | None = None

    address: str | None = None
    city: str | None = None
    country: str | None = None

    website: str | None = None
    github: str | None = None
    linkedin: str | None = None

    role: str

    is_verified: bool

    created_at: datetime

    model_config = {"from_attributes": True}


class MeResponse(BaseModel):
    id: str

    name: str
    email: EmailStr

    phone: str | None = None
    avatar: str | None = None
    bio: str | None = None

    gender: str | None = None

    date_of_birth: date | None = None

    address: str | None = None
    city: str | None = None
    country: str | None = None

    website: str | None = None
    github: str | None = None
    linkedin: str | None = None

    role: str

    is_verified: bool

    created_at: datetime

    model_config = {"from_attributes": True}


class OAuthUser(BaseModel):
    provider: str
    provider_id: str

    email: EmailStr

    name: str | None = None

    picture: str | None = None

    email_verified: bool = False


class UserRoleUpdate(BaseModel):
    role: str
