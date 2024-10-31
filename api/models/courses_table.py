from sqlalchemy import Column, SmallInteger, Text, String, ForeignKey, Boolean
from database import Base

class CoursesTable(Base):
    __tablename__ = 'courses'
    
    id=Column(SmallInteger, primary_key=True, index=True)
    title=Column(String, index=True)
    description=Column(Text, index=True)
    department_id=Column(SmallInteger, ForeignKey('departments.id'), index=True)
    active = Column(Boolean, default=True)
    