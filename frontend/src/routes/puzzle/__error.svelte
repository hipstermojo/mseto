<script lang="ts" context="module">
	import type { ErrorLoadInput, LoadOutput } from '@sveltejs/kit';

	export function load({ error }: ErrorLoadInput): LoadOutput {
		return {
			props: {
				message: error.message
			}
		};
	}
</script>

<script lang="ts">
	export let message: string;
</script>

<main
	class="flex relative flex-col h-screen overflow-hidden justify-center bg-primary text-primary px-6"
>
	<div class="bg-white py-8">
		<h1 class="text-center text-3xl mb-8 text-red-600 font-semibold">{message}</h1>
		<h2 class="text-center text-lg">Return to <a href="/" class="underline">home page</a></h2>
	</div>
</main>
