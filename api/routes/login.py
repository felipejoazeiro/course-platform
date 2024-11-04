from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import SessionLocal
from datetime import timedelta, datetime
from jose import JWTError, jwt
from models.access_table import AccessTable
from models.user_login import Login
from models.employee_table import EmployeeTable
from auth import create_access_token, get_current_user, check_token
import bcrypt
import os

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/login')
def login(login: Login, db: Session = Depends(get_db)):
    
    access_record = db.query(AccessTable).filter(AccessTable.username == login.username).first()
    if not access_record:
        raise HTTPException(status_code=400, detail="Login não existe.")
    
    if not bcrypt.checkpw(login.password.encode('utf-8'), access_record.password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Senha incorreta.")
    
    token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    access_token = create_access_token(data={"user_id": access_record.fk_employee}, expires_delta=token_expires)
    
    if access_record.first_access:
       raise HTTPException(status_code=202, detail={"message":"Resetar senha", "access_token": access_token, "token_type": "bearer"})  
     
    return {"message": "Sucesso", "access_token": access_token, "token_type": "bearer"}

@router.get('/getAdmin')
def getAdmin(db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    access_employee = db.query(EmployeeTable).filter(EmployeeTable.id == current_user).first()
    return {access_employee.admin}
        
        
@router.get('/checkToken')
def checkToken(checkToken: bool = Depends(check_token)):
    return checkToken