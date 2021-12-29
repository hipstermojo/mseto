from itertools import product
import random
from typing import List, Set


words = [
    "haswa",
    "jioni",
    "kadha",
    "kambi",
    "miaka",
    "mrefu",
    "uvumi",
    "vibao",
    "zaidi"
]


def get_all_possible_words(cols: List[Set[str]]) -> List[str]:
    return [''.join(row) for row in product(*cols)]


def get_valid_words(words: List[str]) -> List[str]:
    kamusi = set()
    with open('kamusi.txt') as file:
        kamusi = {line.strip() for line in file.readlines()}

    return [word for word in words if word in kamusi]


def get_cols_from_words(words: List[str]) -> List[Set[str]]:
    cols_set = [set() for _ in words[0]]

    for word in words:
        for i, c in enumerate(word):
            cols_set[i].add(c)
    return cols_set


def shuffle_cols(cols: List[Set[str]], all_words: Set[str]) -> List[List[str]]:
    shuffled = [list(col) for col in cols]

    # Ensure that the "middle line" doesn't form an existing word
    is_badly_shuffled = True
    while is_badly_shuffled:
        for col in shuffled:
            random.shuffle(col)
        word = ""
        for col in shuffled:
            mid = len(col) // 2
            word += col[mid]

        is_badly_shuffled = word in all_words

    return shuffled
