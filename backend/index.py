from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from utils import get_all_possible_words, get_valid_words, words, get_cols_from_words, shuffle_cols

origins = ['http://127.0.0.1:3000',
           'http://localhost:3000', 'http://192.168.1.11:3000', ]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_headers=["*"],
    allow_methods=['GET', 'OPTIONS'])


class PuzzleData(BaseModel):
    core: List[str]
    extra: List[str]
    cols: List[List[str]]


@app.get("/puzzles", response_model=PuzzleData)
def get_puzzle():
    cols = get_cols_from_words(words)
    all_words = get_all_possible_words(cols)
    valid_words = get_valid_words(all_words)
    extra_words = [word for word in valid_words if word not in words]
    return {'core': words, 'extra': extra_words, 'cols': shuffle_cols(cols, set(valid_words))}
