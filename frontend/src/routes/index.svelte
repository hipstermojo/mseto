<script>
	import SplashScreen from '../components/SplashScreen.svelte';
</script>

<main class="bg-primary">
	<!-- <SplashScreen /> -->
	<div class="min-h-screen text-white">
		<h1 class="pt-4 text-center text-secondary uppercase font-semibold text-4xl">Mseto</h1>
		<a
			href="/puzzle"
			class="h-32 w-5/6 mt-32 bg-white mx-auto flex flex-col items-center justify-center text-primary rounded-md"
		>
			<p class="text-xl">Play the Daily Puzzle</p>
		</a>

		<a
			href="/packs"
			class="h-16 w-5/6 mt-8 flex justify-center items-center mx-auto border border-white rounded-md"
		>
			<p class="text-xl">Open Puzzle packs</p>
		</a>
		<a href="/how-to-play" class="mt-8 text-center underline text-xl mx-auto block">How to play</a>
	</div>
</main>
