from pydantic import BaseModel

class Registration(BaseModel):
    name: str
    registration: str
    email: str