from sqlalchemy import Column, SmallInteger, Text, String, ForeignKey, Boolean, DateTime
from database import Base
from datetime import datetime

class FileTable(Base):
    __tablename__ = 'files'
    
    id = Column(SmallInteger, primary_key = True, index= True)
    name = Column(String, index=True)
    type = Column(String, index=True)
    path = Column(Text, index=True)
    fk_course = Column(SmallInteger, ForeignKey('courses.id'), index=True)
    upload_date = Column(DateTime, default=datetime.utcnow)