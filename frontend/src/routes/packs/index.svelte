<script lang="ts">
	const packs = ['Word origin', 'Short and sweet', 'Hardcore linguist'];
</script>

<div>
	{#each packs as pack}
		<div
			class="h-24 mb-8 border text-gray-400 border-gray-400 rounded-md p-2 flex flex-col justify-center items-center"
		>
			<p class="text-center w-full text-lg">{pack}</p>
			<p>Coming soon!</p>
		</div>
	{/each}
</div>
