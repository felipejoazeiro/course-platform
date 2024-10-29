from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import EmailStr
from datetime import timedelta, datetime
from database import SessionLocal
from models.employee_table import EmployeeTable
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from models.access_table import AccessTable
from models.registration import Registration
from models.verification_code import RegistrationCode
from models.verification_codes_table import VerificationCodeTable
from models.new_password import NewPassword
from models.verification_request import VerificationRequest
import bcrypt 
import os
import random 

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_COURSES"),  
    MAIL_PASSWORD=os.getenv("PASSWORD_COURSES"),  
    MAIL_FROM=os.getenv("EMAIL_COURSES"),         
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Plataforma de Cursos",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True   
)

@router.post('/register')
def register_employee(employee: Registration, db: Session = Depends(get_db)):
    existing_employee = db.query(EmployeeTable).filter(EmployeeTable.registration == employee.registration).first()
    if existing_employee:
        raise HTTPException(status_code=400, detail={"message": "Registro já existe"})
    
    try:
        db_employee = EmployeeTable(**employee.dict())
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

@router.put('/newPassword')
def new_password(data: NewPassword, db: Session = Depends(get_db)):
    print(data.id)
    print(data.password)
    user_access = db.query(AccessTable).filter(AccessTable.fk_employee == data.id).first()
    if not user_access:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
    
    user_access.password = hashed_password.decode('utf-8')
    
    db.commit()
    db.refresh(user_access)
    
    user_access.first_access = False
    db.commit()
    db.refresh(user_access)
    
    return {
        "message": "Senha alterada com sucesso",
    }
    
@router.post('/sendVerificationCode')
async def verification_code(registration: RegistrationCode, db: Session = Depends(get_db)):
    employee = db.query(EmployeeTable).filter(EmployeeTable.registration == registration.registration).first()
    if not employee:
        raise HTTPException(status_code=404, detail={"message": "Matrícula não encontrada"})
    
    code = random.randint(100000, 999999)
    verification_code = VerificationCodeTable(user_id= employee.id, code= code)
    db.add(verification_code)
    db.commit()
    
    message = MessageSchema(
        subject="Código de verificação",
        recipients=[employee.email],
        body=f"Seu código de verificação é: {code}",
        subtype=MessageType.html     
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message)
        return {"message":"Código de verificação enviado"}
    except Exception as e:
        print(e)    
        

@router.post("/verifyCode")
async def verify_code(verification_request: VerificationRequest, db: Session = Depends(get_db)):
    employee = db.query(EmployeeTable).filter(EmployeeTable.registration == verification_request.registration).first()
    if not employee: 
        raise HTTPException(status_code=404, detail={"message": "Usuário não encontrado"})
    
    verification_code = db.query(VerificationCodeTable).filter(
        VerificationCodeTable.user_id == employee.id,
        VerificationCodeTable.code == verification_request.code
    ).order_by(VerificationCodeTable.created_at.desc()).first()
    
    if not verification_code:
        raise HTTPException(Status_code=400, detail="Código de verificação inválido")
    
    if datetime.utcnow() - verification_code.created_at > timedelta(minutes=5):
        raise HTTPException(status_code=400, detail="Código de verificação expirado")
    
    return {"message": "Código de verificação válido", "user_id": employee.id}
