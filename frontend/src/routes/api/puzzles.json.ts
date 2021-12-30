import type { EndpointOutput, IncomingRequest } from '@sveltejs/kit';

export async function get({ query }: IncomingRequest): Promise<EndpointOutput> {
	const id = query.get('id');
	if (!id) {
		return { status: 400 };
	}
	const BASE_URL = process.env.API_URL || 'http://127.0.0.1:8000';
	const url = `${BASE_URL}/${id}`;
	const res = await fetch(url);

	if (res.ok) {
		const data = await res.json();
		return {
			body: { ...data }
		};
	}
	return { status: res.status };
}
