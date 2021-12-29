from datetime import date
from typing import List
from uuid import UUID

from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from core.db import add_new_puzzle
from core.lib import get_cols_from_words
from core.schema import PuzzleData, PackOut, PuzzleIn, PuzzleOut, PackIn
from core.models import Pack, Word, Puzzle, WordPuzzle

origins = ['http://127.0.0.1:3000',
           'http://localhost:3000', 'http://192.168.1.11:3000', ]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_headers=["*"],
    allow_methods=['GET', 'OPTIONS'])


@app.get("/puzzles/{id}", response_model=PuzzleData, tags=['puzzle'])
async def get_puzzle_data(id: UUID):
    puzzle = await Puzzle.get(id=id)
    words_in_puzzle_rows = await WordPuzzle.filter(puzzle=puzzle)
    core = []
    extra = []
    for word_puzzle in words_in_puzzle_rows:
        word_qs = word_puzzle.word
        word: Word = await word_qs.first()
        if word_puzzle.role == "core":
            core.append(word.text)
        else:
            extra.append(word.text)
    return {'core': core, 'extra': extra, 'cols': get_cols_from_words(core)}


@app.post("/puzzles", response_model=PuzzleOut, tags=['puzzle'])
async def create_puzzle(data: PuzzleIn):
    return await add_new_puzzle(data)


@app.get("/packs", response_model=List[PackOut], tags=['packs'])
async def get_packs():
    return await Pack.exclude(name='daily')


@app.post("/packs", response_model=PackOut, tags=["packs"])
async def create_pack(data: PackIn = Body(...)):
    return await Pack.create(**data.dict())


@app.get("/packs/daily", response_model=PuzzleOut, tags=['puzzle'])
async def get_daily_puzzle():
    today = date.today()
    daily_puzzle_pack = await Pack.get(name="daily")
    if daily_puzzle_pack:
        puzzle_today = await daily_puzzle_pack.puzzles.filter(name=today.isoformat()).first()
        return puzzle_today


@app.post("/packs/daily")
async def create_daily_puzzle(data: PuzzleIn):
    daily_pack = await Pack.get(name="daily")
    data.pack_id = daily_pack.id
    if data.name is None:
        data.name = date.today().isoformat()
    return await add_new_puzzle(data)


@app.get("/packs/{id}", response_model=List[PuzzleOut], tags=['packs'])
async def get_puzzles_from_pack(id: UUID):
    pack = await Pack.get(id=id)
    if pack:
        return pack.puzzles


register_tortoise(app, db_url="sqlite://db.sqlite3",
                  modules={"models": ["core.models"]},
                  generate_schemas=True,
                  add_exception_handlers=True,)
