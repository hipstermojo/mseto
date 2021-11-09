<script lang="ts">
	import PuzzleRow from './PuzzleRow.svelte';

	const getLetter = (i: number): string => String.fromCharCode(65 + i);
	const getRandomNumber = () => Math.floor(Math.random() * 4) + 3;
	const rows = new Array(5)
		.fill([])
		.map((_, i) => new Array(getRandomNumber()).fill('').map((_, j) => getLetter(j * 5 + i)));
</script>

<div class="flex justify-center relative h-12 overflow-visible">
	<div class="absolute w-full bg-white h-12 bg-opacity-30" />
	{#each rows as row}
		<PuzzleRow letters={row} />
	{/each}
</div>
