from sqlalchemy import Column, SmallInteger, String
from database import Base

class EmployeeTable(Base):
    __tablename__ = 'employee'
    
    id = Column(SmallInteger, primary_key = True, index=True)
    name = Column(String, index=True)
    registration = Column(String, unique=True, index=True)
    email = Column(String, index=True)