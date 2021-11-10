<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	export let letters: string[];

	const rowLength = letters.length;
	const midPoint = Math.floor(rowLength / 2);

	const move = (unit: number) => {
		if (maxAllowedMovement(unit)) {
			rowPos += unit;
		}
	};
	const maxAllowedMovement = (unit: number) => {
		return rowPos + unit < 0 && rowPos + unit > -(letters.length + 1);
	};

	const maxAllowedScroll = (unit: number) => {
		return -(rowPos + unit) < letters.length + 1 && -(rowPos + unit) > -1;
	};

	$: rowPos = -midPoint;
	let offset = spring(52 * -midPoint, { stiffness: 0.2, damping: 0.45 });

	let canvasElem: HTMLElement;
	let startY: number | undefined;
	let movedBy = 0;

	let started = (ev: TouchEvent) => {
		ev.preventDefault();

		startY = ev.changedTouches[0].clientY;
	};
	let updateOffset = (ev: TouchEvent) => {
		ev.preventDefault();
		let touches = ev.changedTouches;

		for (let i = 0; i < touches.length; i++) {
			const { clientY } = touches[i];
			const movY = clientY - 0;
			const unitsMoved = Math.floor((movY - startY) / 52);
			if (movedBy != unitsMoved) {
				movedBy = unitsMoved;
			}
			if (maxAllowedScroll(unitsMoved)) {
				offset.set(52 * rowPos + (movY - startY));
			}
		}
	};

	let realignParent = (ev: TouchEvent) => {
		ev.preventDefault();
		const endY = ev.changedTouches[0].clientY;
		const units = Math.floor((endY - startY) / 52);
		let newPos: number;

		if (rowPos + units > 0) {
			newPos = 0;
		} else if (rowPos + units <= -letters.length) {
			newPos = -letters.length + 1;
		} else {
			newPos = rowPos + units;
		}

		rowPos = newPos;
		offset.set(52 * rowPos);
	};

	onMount(() => {
		canvasElem.addEventListener('touchstart', started, false);
		canvasElem.addEventListener('touchmove', updateOffset, false);
		canvasElem.addEventListener('touchend', realignParent, false);
	});

	onDestroy(() => {
		if (canvasElem) {
			canvasElem.removeEventListener('touchstart', started);
			canvasElem.removeEventListener('touchmove', updateOffset);
			canvasElem.removeEventListener('touchend', realignParent);
		}
	});
</script>

<div style="transform: translateY({$offset}px);" class="relative h-screen">
	{#each letters as letter}
		<div class="bg-secondary flex flex-col mb-1 mr-1 items-center justify-center w-12 h-12">
			<p class="uppercase text-2xl">{letter}</p>
		</div>
	{/each}

	<canvas
		style="height: {52 * (letters.length + 2)}px;"
		bind:this={canvasElem}
		class="absolute w-12 top-0 -translate-y-12"
	/>
</div>
