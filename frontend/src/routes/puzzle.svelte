<script lang="ts">
	import PuzzleGrid from '../components/PuzzleGrid.svelte';
</script>

<main class="flex relative flex-col h-screen overflow-hidden justify-center bg-primary">
	<div
		class="absolute top-0 py-6 z-10 px-8 flex justify-between w-full bg-gradient-to-b from-primary via-primary to-transparent"
	>
		<a href="/" title="back to main page" class="">
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
				/>
			</svg>
		</a>
		<div class="">
			<h1 class="text-white font-semibold text-2xl">0/15</h1>
		</div>
	</div>
	<PuzzleGrid />
	<div
		class="h-24 absolute bottom-0 w-full bg-gradient-to-t from-primary via-primary to-transparent"
	/>
</main>
