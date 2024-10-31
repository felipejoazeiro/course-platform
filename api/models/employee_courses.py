from sqlalchemy import Column, SmallInteger, ForeignKey, DateTime 
from datetime import datetime
from database import Base

class EmployeeCoursesTable(Base):
    __tablename__ = 'employee_courses'
    
    id = Column(SmallInteger, primary_key = True, index = True)
    employee_id = Column(SmallInteger, ForeignKey('employee.id'), index = True)
    course_id = Column(SmallInteger, ForeignKey('courses.id'), index = True)
    completion_date = Column(DateTime, default=datetime.utcnow)