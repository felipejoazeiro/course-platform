from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import SessionLocal
from datetime import timedelta, datetime
from jose import JWTError, jwt
from models.access_table import AccessTable
from models.user_login import Login
from auth import create_access_token
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
    
    if access_record.first_access:
       raise HTTPException(status_code=202, detail={"message":"Resetar senha", "user_id": access_record.fk_employee})  
     
    token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    access_token = create_access_token(data={"user_id": access_record.fk_employee}, expires_delta=token_expires)
    
    return {"message": "Sucesso", "access_token": access_token, "token_type": "bearer"}
    