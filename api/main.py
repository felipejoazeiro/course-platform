from fastapi import FastAPI
from routes.login import router as login_router
from fastapi.middleware.cors import CORSMiddleware
from routes.register import router as register_router
from routes.courses import router as courses_router
from routes.departments import router as departments_router
from routes.files import router as files_router
from routes.ppt import router as ppt_router

app = FastAPI()

# Registrando as rotas do login
app.include_router(login_router)
app.include_router(register_router)
app.include_router(courses_router)
app.include_router(departments_router)
app.include_router(files_router)
app.include_router(ppt_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permita seu frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permita todos os métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permita todos os cabeçalhos
)

@app.get('/')
def home():
    return {"mensagem": "Servidor ligado"}