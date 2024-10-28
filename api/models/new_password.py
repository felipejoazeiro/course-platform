from pydantic import BaseModel

class NewPassword(BaseModel):
    id: int
    password: str