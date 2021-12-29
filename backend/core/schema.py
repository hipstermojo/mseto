from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel
from tortoise.contrib.pydantic.creator import pydantic_model_creator

from core.lib import get_all_possible_words, get_cols_from_words, get_valid_words
from core.models import Pack, Puzzle


class PuzzleData(BaseModel):
    core: List[str]
    extra: List[str]
    cols: List[List[str]]

    @classmethod
    def from_words(cls, words: List[str]):
        cols = get_cols_from_words(words)
        all_words = get_all_possible_words(cols)
        valid_words = get_valid_words(all_words)
        extra_words = [word for word in valid_words if word not in words]
        return PuzzleData(core=words, extra=extra_words, cols=cols)


class PackIn(BaseModel):
    name: str
    description: Optional[str]


class PuzzleIn(BaseModel):
    words: List[str]
    name: Optional[str]
    pack_id: UUID


PackOut = pydantic_model_creator(Pack)
PuzzleOut = pydantic_model_creator(Puzzle)
