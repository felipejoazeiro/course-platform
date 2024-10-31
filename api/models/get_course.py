from pydantic import BaseModel

class GetCourse(BaseModel):
    department_id: int
