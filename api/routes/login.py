from fastapi import APIRouter
from models.user_login import Login

router = APIRouter()

@router.get('/login')
def login():
    return {"mensagem": "Página de login"}

@router.post('/login')
def login(login: Login):
    return {"login": f'Login: {login.username}'}
    