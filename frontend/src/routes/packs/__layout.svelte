<script>
	import ArrowBack from '../../components/utils/icons/ArrowBack.svelte';
</script>

<main class="bg-primary text-white px-4 pb-20 min-h-screen">
	<nav class="py-4 flex sticky top-0 w-full justify-center bg-primary">
		<a href="/" title="back to main page" class="absolute left-4 top-6">
			<ArrowBack />
		</a>
		<h1 class="text-secondary uppercase font-semibold text-4xl">Mseto</h1>
	</nav>
	<slot />
</main>
