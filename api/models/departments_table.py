from database import Base
from sqlalchemy import Column, SmallInteger, Text

class DepartmentsTable(Base):
    __tablename__ = 'departments'
    
    id = Column(SmallInteger, primary_key = True, index = True)
    name = Column(Text, index = True)
    active = Column(Boolean, default = True)