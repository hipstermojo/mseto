import type { RequestHandler } from '@sveltejs/kit';

import { readFileSync } from 'fs';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

import bloomFiltersPkg from 'bloom-filters';

import { DAILY_PUZZLE_DATE_FORMAT, DAILY_PUZZLE_PACK } from '$lib/utils/constants';
import { allPossibleWordsFromCols, wordsToCols } from '$lib/utils/puzzle';

dayjs.extend(customParseFormat);

const { BloomFilter } = bloomFiltersPkg;
const filter_export = readFileSync('./static/b_filter.json', { encoding: 'utf-8' });
const SWAHILI_WORDS = BloomFilter.fromJSON(JSON.parse(filter_export));

export const post: RequestHandler = async ({ request, locals: { prisma } }) => {
	// Currently only supports adding new daily puzzles
	const data: string[] = await request.json();

	const words = data.map((word) => word.trim().toLowerCase());
	const uniqueWords = [...new Set(words)];

	if (uniqueWords.length < 2) {
		return {
			status: 400,
			body: { err: 'Puzzle creation requires more than one unique word to be provided' }
		};
	} else if (uniqueWords.length > 7) {
		return {
			status: 400,
			body: { err: 'Too many words provided. Maximum allowed words is 7' }
		};
	}
	const wordLength = uniqueWords[0].length;
	if (wordLength < 4 || wordLength > 7) {
		return { status: 400, body: { err: 'Words must have a length between 4 and 7 inclusive' } };
	}

	const isSameLength = uniqueWords.every((word) => word.length == wordLength);
	if (!isSameLength) {
		return {
			status: 400,
			body: { err: 'Words must be of the same length' }
		};
	}

	const hasInvalidSwahili = uniqueWords.some((word) => !SWAHILI_WORDS.has(word));

	if (hasInvalidSwahili) {
		return {
			status: 400,
			body: { err: 'Words must all be valid Swahili words.' }
		};
	}

	const columns = wordsToCols(uniqueWords);
	const allPossibleWords = allPossibleWordsFromCols(columns);
	const invalidCount = allPossibleWords.reduce(
		(count, word) => (!SWAHILI_WORDS.has(word) ? count + 1 : count),
		0
	);

	if (invalidCount == 0) {
		return {
			status: 400,
			body: { err: 'Word input solves itself in any combination' }
		};
	}

	await prisma.word.createMany({
		data: uniqueWords.map((text) => ({ text })),
		skipDuplicates: true
	});

	let dailyPack = await prisma.pack.findFirst({ where: { name: DAILY_PUZZLE_PACK } });
	if (!dailyPack) {
		dailyPack = await prisma.pack.create({ data: { name: DAILY_PUZZLE_PACK } });
	}
	const latestDailyPuzzle = await prisma.puzzle.findFirst({
		where: { packId: dailyPack.id },
		orderBy: { created: 'desc' }
	});

	let puzzleDate = dayjs();
	if (
		latestDailyPuzzle &&
		dayjs(latestDailyPuzzle.name, DAILY_PUZZLE_DATE_FORMAT).isAfter(puzzleDate, 'day')
	) {
		puzzleDate = dayjs(latestDailyPuzzle.name, DAILY_PUZZLE_DATE_FORMAT).add(1, 'day');
	}

	const newPuzzle = await prisma.puzzle.create({
		data: { packId: dailyPack.id, name: puzzleDate.format(DAILY_PUZZLE_DATE_FORMAT) }
	});

	await prisma.wordPuzzle.createMany({
		data: data.map((word) => ({ puzzleId: newPuzzle.id, wordId: word }))
	});
	return { status: 201 };
};
