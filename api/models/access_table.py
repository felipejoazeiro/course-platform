from sqlalchemy import Column, SmallInteger, String
from database import Base

class AccessTable(Base):
    __tablename__ = 'access'
    
    id = Column(SmallInteger, primary_key = True, index=True)
    username = Column(String, index=True)
    password = Column(String)
    fk_employee = Column(SmallInteger, index=True)