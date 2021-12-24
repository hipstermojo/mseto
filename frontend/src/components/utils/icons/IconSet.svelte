<script lang="ts">
	type IconType = 'arrow-back' | 'chevron-down' | 'chevron-up';
	export let type: IconType;

	const svgPathMap: Record<IconType, string> = {
		'arrow-back': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>`,
		'chevron-down': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />`,
		'chevron-up': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />`
	};
</script>

<svg
	class="w-6 h-6 text-white"
	fill="none"
	stroke="currentColor"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	{@html svgPathMap[type]}
</svg>
