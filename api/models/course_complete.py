from pydantic import BaseModel

class CourseComplete(BaseModel):
    employee_id: int
    course_id: int
