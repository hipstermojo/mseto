<script lang="ts">
	import PuzzleGrid from '../components/PuzzleGrid.svelte';
</script>

<main class="px-8 flex relative flex-col h-screen overflow-hidden justify-center bg-primary">
	<a href="/" class="absolute top-6 left-8">
		<svg
			class="w-6 h-6 text-white"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			/></svg
		>
	</a>
	<PuzzleGrid />
</main>
