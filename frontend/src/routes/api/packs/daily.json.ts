import type { IncomingRequest } from '@sveltejs/kit';

export async function get(_: IncomingRequest) {
	const url = 'http://127.0.0.1:8000/packs/daily';
	const res = await fetch(url);

	if (res.ok) {
		const data = await res.json();
		return {
			body: { ...data }
		};
	}
	return {
		status: 400
	};
}
