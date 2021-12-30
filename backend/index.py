from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from tortoise.contrib.fastapi import register_tortoise

from core.lib import AlwaysBadlyShuffledError, InsufficientWordsProvidedError
from core.routes import router
from core.settings import DATABASE_URL

origins = ['http://127.0.0.1:3000',
           'http://localhost:3000', 'http://192.168.1.11:3000', ]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_headers=["*"],
    allow_methods=['GET', 'OPTIONS'])

app.include_router(router)


@app.exception_handler(AlwaysBadlyShuffledError)
def always_badly_shuffled_handler(req: Request, exc: AlwaysBadlyShuffledError):
    return JSONResponse(status_code=400, content={"message": exc.message})


@app.exception_handler(InsufficientWordsProvidedError)
def insufficient_words_provided_handler(req: Request, exc: InsufficientWordsProvidedError):
    return JSONResponse(status_code=400, content={"message": exc.message})


register_tortoise(app, db_url=DATABASE_URL,
                  modules={"models": ["core.models"]},
                  add_exception_handlers=True,)
