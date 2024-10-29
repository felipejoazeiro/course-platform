from pydantic import BaseModel

class VerificationRequest(BaseModel):
    registration: str
    code: str
    recaptcha: str