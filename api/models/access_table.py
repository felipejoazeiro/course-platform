from sqlalchemy import Column, SmallInteger, String, Boolean
from database import Base

class AccessTable(Base):
    __tablename__ = 'access'
    
    id = Column(SmallInteger, primary_key = True, index=True)
    username = Column(String, index=True)
    password = Column(String)
    first_access = Column(Boolean)
    fk_employee = Column(SmallInteger, index=True)