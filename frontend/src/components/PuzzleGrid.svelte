<script lang="ts">
	import PuzzleRow from './PuzzleRow.svelte';

	const getLetter = (i: number): string => String.fromCharCode(65 + i);
</script>

<div class="flex mx-auto">
	{#each { length: 5 } as _, i}
		<PuzzleRow
			letters={new Array(Math.floor(Math.random() * 2) + 3)
				.fill(0)
				.map((_, j) => getLetter(j * 5 + i))}
		/>
	{/each}
</div>
