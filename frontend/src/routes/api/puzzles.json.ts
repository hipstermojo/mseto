import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) {
		return { status: 400 };
	}
	const BASE_URL = process.env['API_URL'] || 'http://127.0.0.1:8000';
	const puzzlesUrl = `${BASE_URL}/puzzles/${id}`;

	const res = await fetch(puzzlesUrl);

	if (res.ok) {
		const data = await res.json();
		return {
			body: { ...data }
		};
	}
	return { status: res.status };
};
