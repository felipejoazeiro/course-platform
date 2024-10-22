from fastapi import FastAPI
from routes.login import router as login_router

app = FastAPI()

# Registrando as rotas do login
app.include_router(login_router)

@app.get('/')
def home():
    return {"mensagem": "Servidor ligado"}