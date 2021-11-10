<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<div
	transition:fade|local={{ delay: 1000, duration: 300 }}
	id="game-over"
	class="absolute h-screen w-full bg-primary text-white pt-24 flex flex-col items-center justify-center -translate-y-24 p-4"
>
	<h2 class="text-3xl mb-4">Puzzle completed!</h2>
	<p class="text-lg">Come back tomorrow for a new one</p>
</div>
