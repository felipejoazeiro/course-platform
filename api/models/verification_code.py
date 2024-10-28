from pydantic import BaseModel

class RegistrationCode(BaseModel):
    registration: str
    
    
