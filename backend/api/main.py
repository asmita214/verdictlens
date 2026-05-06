from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.data_loader import load_all
from api.routes import judges, analyze, search

app = FastAPI(
    title="VerdictLens API",
    description="Judicial intelligence platform for Indian courts",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://localhost:3000",
                   "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    loaded = load_all()
    judges.set_data(loaded)
    analyze.set_data(loaded)
    search.set_data(loaded)
    print("API ready")

@app.get("/")
def root():
    return {"message": "VerdictLens API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

app.include_router(judges.router)
app.include_router(analyze.router)
app.include_router(search.router)