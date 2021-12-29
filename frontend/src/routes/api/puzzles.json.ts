import type { EndpointOutput, IncomingRequest } from '@sveltejs/kit';

export async function get({ query }: IncomingRequest): Promise<EndpointOutput> {
	const id = query.get('id');
	if (!id) {
		return { status: 400 };
	}

	const url = `http://127.0.0.1:8000/puzzles/${id}`;
	const res = await fetch(url);

	if (res.ok) {
		const data = await res.json();
		return {
			body: { ...data }
		};
	}
	// TODO: Add error handling

	const core = [];
	const extra = [];

	const cols = [];

	return {
		status: 200,
		body: {
			data: {
				core,
				extra,
				cols
			}
		}
	};
}
