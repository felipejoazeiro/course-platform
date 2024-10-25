from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import SessionLocal
from models.register_table import RegistrationTable
from models.access_table import AccessTable
from models.registration import Registration
import bcrypt 
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post('/register')
def register_employee(employee: Registration, db: Session = Depends(get_db)):
    print(employee)
    existing_employee = db.query(RegistrationTable).filter(RegistrationTable.registration == employee.registration).first()
    if existing_employee:
        raise HTTPException(status_code=400, detail={"message": "Registro já existe"})
    
    try:
        db_employee = RegistrationTable(**employee.dict())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        
        hashed_password = bcrypt.hashpw(employee.registration.encode('utf-8'), bcrypt.gensalt())
        
        access_record = AccessTable(username = employee.registration, password = hashed_password.decode('utf-8'), fk_employee = db_employee.id, first_access= True)
        db.add(access_record)
        db.commit()
    except SQLAlchemyError as e:
       db.rollback()
       raise HTTPException(status_code=500, detail={"message": "Erro ao registrar o funcionário", "error": str(e)})
        
    return {"message": "Funcionário registrado com sucesso."}