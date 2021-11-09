<script lang="ts">
	import ArrowBack from '../components/utils/icons/ArrowBack.svelte';
	import PuzzleGrid from '../components/PuzzleGrid.svelte';
</script>

<main class="flex relative flex-col h-screen overflow-hidden justify-center bg-primary">
	<div class="absolute top-0 pt-6 z-10 px-8 flex justify-between w-full bg-primary">
		<a href="/" title="back to main page" class="">
			<ArrowBack />
		</a>
		<div class="">
			<h1 class="text-white font-semibold text-2xl">0/15</h1>
		</div>
		<div class="h-6 absolute -bottom-6 w-full bg-gradient-to-b from-primary to-transparent" />
	</div>
	<PuzzleGrid />
	<div
		class="h-24 absolute bottom-0 w-full bg-gradient-to-t from-primary via-primary to-transparent"
	/>
</main>
