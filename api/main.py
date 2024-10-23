from fastapi import FastAPI
from routes.login import router as login_router
from routes.register import router as register_router

app = FastAPI()

# Registrando as rotas do login
app.include_router(login_router)
app.include_router(register_router)

@app.get('/')
def home():
    return {"mensagem": "Servidor ligado"}