<script lang="ts">
	export let letters: string[];

	const move = (unit: number) => {
		if (maxAllowedMovement(unit)) {
			offset += unit;
		}
	};

	const maxAllowedMovement = (unit: number) =>
		Math.abs(offset + unit) <= Math.floor(letters.length / 2);

	$: getYOffset = (): number => {
		if (offset != 0) {
			return 52 * offset;
		} else {
			return 0;
		}
	};
	$: offset = 0;
</script>

<div style="transform: translateY({getYOffset()}px);" class="duration-300 transition-transform">
	<button on:click={() => move(-1)} class="text-white mx-auto block h-12 mb-1">
		<svg
			class="w-6 h-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M5 15l7-7 7 7"
			/></svg
		>
	</button>
	{#each letters as letter}
		<div class="bg-secondary flex flex-col mb-1 mr-1 items-center justify-center w-12 h-12">
			<p class="uppercase text-xl">{letter}</p>
		</div>
	{/each}
	<button on:click={() => move(1)} class="text-white mx-auto block h-12 mb-1"
		><svg
			class="w-6 h-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 9l-7 7-7-7"
			/></svg
		></button
	>
</div>
