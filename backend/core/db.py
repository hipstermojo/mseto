from typing import List
from core.models import Puzzle, Word, WordPuzzle
from core.schema import PuzzleData, PuzzleIn


async def add_new_puzzle(data: PuzzleIn) -> Puzzle:
    word_list: List[Word] = []
    puzzle_data = PuzzleData.from_words(data.words)
    save_words = data.words + puzzle_data.extra
    for word in save_words:
        saved_word = await Word.get_or_create(text=word)
        word_list.append(saved_word[0])
    puzzle = await Puzzle.create(name=data.name, pack_id=data.pack_id)
    for word in word_list:
        if word.text in data.words:
            role = "core"
        else:
            role = "extra"
        await WordPuzzle.create(puzzle=puzzle, word=word, role=role)
    return puzzle
