from sqlalchemy import Column, SmallInteger, Integer, String, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
from models.employee_table import EmployeeTable

class VerificationCodeTable(Base):
    __tablename__ = 'verification_codes'
    
    id=Column(SmallInteger, primary_key = True, index=True)
    user_id=Column(SmallInteger, ForeignKey('employee.id'), index=True)
    code = Column(Integer, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    

