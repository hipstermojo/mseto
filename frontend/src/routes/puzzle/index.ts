import type { RequestHandler } from '@sveltejs/kit';
import dayjs from 'dayjs';

import { DAILY_PUZZLE_DATE_FORMAT } from '$lib/utils/constants';

export const get: RequestHandler = async ({ locals: { prisma } }) => {
	const today = dayjs();
	const todayPuzzle = await prisma.puzzle.findFirst({
		where: { name: today.format(DAILY_PUZZLE_DATE_FORMAT) },
		select: { words: { select: { wordId: true } } }
	});
	if (todayPuzzle) {
		const words = todayPuzzle.words.map(({ wordId }) => wordId);

		return { status: 200, body: { words } };
	}

	return { status: 404, body: { message: 'Daily puzzle not generated' } };
};
