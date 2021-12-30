import type { EndpointOutput, IncomingRequest } from '@sveltejs/kit';

export async function get(_: IncomingRequest): Promise<EndpointOutput> {
	const BASE_URL = process.env['API_URL'] || 'http://127.0.0.1:8000';

	const url = `${BASE_URL}/packs/daily`;
	try {
		const res = await fetch(url);

		if (res.ok) {
			const data = await res.json();
			return {
				body: { ...data }
			};
		}
		return {
			status: res.status
		};
	} catch (error) {
		if (error.code == 'ECONNREFUSED') {
			return { status: 503 };
		}
		return { status: 500 };
	}
}
