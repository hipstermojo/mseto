from datetime import date, timedelta
from typing import List
from uuid import UUID

from fastapi import APIRouter, Body, HTTPException
from fastapi.param_functions import Path


from core.db import add_new_puzzle
from core.lib import InsufficientWordsProvidedError, get_cols_from_words, shuffle_cols
from core.models import Puzzle, Word, Pack, WordPuzzle
from core.schema import PackIn, PuzzleData, PackOut, PuzzleIn, PuzzleOut

router = APIRouter()


@router.get("/puzzles/{id}", response_model=PuzzleData, tags=['puzzles'])
async def get_puzzle_data(id: UUID):
    puzzle = await Puzzle.get(id=id)
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle does not exist")
    words_in_puzzle_rows = await WordPuzzle.filter(puzzle=puzzle)
    core = []
    extra = []
    for word_puzzle in words_in_puzzle_rows:
        word_qs = word_puzzle.word
        # While this is perceived as a type error, the code actually runs
        word: Word = await word_qs.first()
        if word_puzzle.role == "core":
            core.append(word.text)
        else:
            extra.append(word.text)
    cols = get_cols_from_words(core)
    return {'core': core, 'extra': extra, 'cols': shuffle_cols(cols, set(core + extra))}


@router.get("/packs", response_model=List[PackOut], tags=['packs'])
async def get_packs():
    return await Pack.exclude(name='daily')


@router.get("/packs/daily", response_model=PuzzleOut, tags=['puzzles'])
async def get_daily_puzzle():
    today = date.today()
    daily_puzzle_pack = await Pack.get(name="daily")
    if daily_puzzle_pack:
        puzzle_today = await daily_puzzle_pack.puzzles.filter(name=today.isoformat()).first()
        if puzzle_today:
            return puzzle_today
        else:
            raise HTTPException(
                status_code=404, detail="Daily puzzle has not been made")
    else:
        raise HTTPException(
            status_code=404, detail="Daily puzzle pack does not exist")


@router.get("/packs/{id}", response_model=List[PuzzleOut], tags=['puzzles'])
async def get_puzzles_from_pack(id: UUID = Path(..., description="Pack ID")):
    pack = await Pack.get(id=id)
    if pack:
        puzzles = await pack.puzzles.all()
        return puzzles
    else:
        raise HTTPException(
            status_code=404, detail="Puzzle pack does not exist")


@router.post("/packs", response_model=PackOut, tags=["packs"])
async def create_pack(data: PackIn = Body(...)):
    return await Pack.create(**data.dict())


@router.post("/puzzles", response_model=PuzzleOut, tags=['puzzles'])
async def create_puzzle(data: PuzzleIn):

    uniq_words = {word.lower() for word in data.words}

    if len(uniq_words) <= 1:
        raise InsufficientWordsProvidedError()
    return await add_new_puzzle(data)


@router.post("/packs/daily",  response_model=PuzzleOut, tags=['puzzles'])
async def create_daily_puzzle(words: List[str]):
    uniq_words = {word.lower() for word in words}
    if len(uniq_words) <= 1:
        raise InsufficientWordsProvidedError()

    daily_pack = await Pack.get(name="daily")
    pack_id = daily_pack.id
    most_recent_puzzle = await daily_pack.puzzles.order_by('-created').first()
    today = date.today()
    name = today.isoformat()

    if most_recent_puzzle:
        try:
            most_recent_puzzle_date = date.fromisoformat(
                most_recent_puzzle.name)
            day_after_most_recent = most_recent_puzzle_date + timedelta(days=1)
            if day_after_most_recent > today:
                name = day_after_most_recent.isoformat()
        except(ValueError):
            pass
    data = PuzzleIn(name=name, pack_id=pack_id, words=words)
    return await add_new_puzzle(data)
