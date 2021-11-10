<script lang="ts">
	import { dailyPuzzle } from '../store';

	const tileCount = $dailyPuzzle.cols.reduce((acc, cur) => acc + cur.length, 0);
	// TODO: is there an optimization for this? it currently runs in O(n²) time which is bad
	const completedCount = $dailyPuzzle.cols.reduce(
		(acc, cur) => acc + cur.filter(({ done }) => done).length,
		0
	);
</script>

<h1 class="text-white font-semibold text-2xl">{completedCount}/{tileCount}</h1>
