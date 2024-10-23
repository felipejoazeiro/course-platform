from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.register_table import RegistrationTable
from models.registration import Registration

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post('/register')
def register_employee(employee: Registration, db: Session = Depends(get_db)):
    existing_employee = db.query(RegistrationTable).filter(RegistrationTable.registration == employee.registration).first()
    if existing_employee:
        raise HTTPException(status_code=400, detail="Registro já existe.")
    
    db_employee = RegistrationTable(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)