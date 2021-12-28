export async function get(_) {
	const url = 'http://127.0.0.1:8000/puzzles';
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
