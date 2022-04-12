<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import type { PuzzleTile } from '$lib/utils/types';
	import { puzzleMachine } from '$lib/store/index';

	export let tiles: PuzzleTile[];
	export let index: number;

	const { state, send } = puzzleMachine;
	const midPoint = $state.context.rowPositions[index];

	const isAllowedScroll = (unit: number) => {
		return -(rowPos + unit) < tiles.length + 1 && -(rowPos + unit) > -1;
	};

	$: highlighted = $state.context.wordExists;
	$: rowPos = -midPoint;
	let offset = $state.context.columnSprings[index];

	let canvasElem: HTMLElement;
	let touchStartY: number | undefined;
	let mouseStartY: number | null = null;
	let movedBy = 0;

	const moveColumn = (distanceMoved: number) => {
		const unitsMoved = Math.floor(distanceMoved / 52);

		if (movedBy != unitsMoved) {
			movedBy = unitsMoved;
			if (rowPos + movedBy <= 0 && rowPos + movedBy > -tiles.length) {
				send('MOVE', { colIdx: index, rowIdx: Math.abs(rowPos + movedBy) });
			}
		}
		if (isAllowedScroll(unitsMoved)) {
			offset.set(52 * rowPos + distanceMoved);
		}
	};

	const realignParent = (units: number) => {
		let newPos: number;

		if (rowPos + units > 0) {
			newPos = 0;
		} else if (rowPos + units <= -tiles.length) {
			newPos = -tiles.length + 1;
		} else {
			newPos = rowPos + units;
		}

		rowPos = newPos;
		send('ALIGN', { colIdx: index, rowIdx: -rowPos, moveFn: (_) => 52 * rowPos });
		send('CHECK');
	};

	const touchStart = (ev: TouchEvent) => {
		ev.preventDefault();
		touchStartY = ev.changedTouches[0].clientY;
		send('MOVE_START', { colIdx: index });
	};

	const touchMove = (ev: TouchEvent) => {
		ev.preventDefault();

		let touches = ev.changedTouches;

		for (let i = 0; i < touches.length; i++) {
			const { clientY } = touches[i];
			const movY = clientY - 0;
			moveColumn(movY - touchStartY);
		}
	};

	const touchEnd = (ev: TouchEvent) => {
		ev.preventDefault();
		if ($state.matches('completed')) {
			return;
		}
		const endY = ev.changedTouches[0].clientY;
		const units = Math.floor((endY - touchStartY) / 52);
		realignParent(units);
	};

	const mouseStart = (ev: MouseEvent) => {
		ev.preventDefault();
		mouseStartY = ev.clientY;
		send('MOVE_START', { colIdx: index });
	};

	const mouseMove = (ev: MouseEvent) => {
		ev.preventDefault();
		if (
			// Only compute movements when the primary (left) button is pressed down
			ev.buttons != 1 ||
			// Only move the column first clicked on
			$state.context.colIdx != index
		) {
			return;
		}

		moveColumn(ev.clientY - mouseStartY);
	};

	const mouseLeave = (ev: MouseEvent) => {
		ev.preventDefault();
		if (ev.buttons != 1 || $state.context.colIdx != index) {
			return;
		}
		// Reset the column position if the mouse click goes out of bounds.
		// The mouseup event cannot be fired if the mouse click is released outside the region of the element
		const units = Math.floor((ev.clientY - mouseStartY) / 52);
		realignParent(units);
	};

	const mouseUp = (ev: MouseEvent) => {
		ev.preventDefault();
		if ($state.context.colIdx != index || $state.matches('completed')) {
			return;
		}
		const endY = ev.clientY;
		const units = Math.floor((endY - mouseStartY) / 52);
		realignParent(units);
	};

	onMount(() => {
		canvasElem.addEventListener('touchstart', touchStart, false);
		canvasElem.addEventListener('touchmove', touchMove, false);
		canvasElem.addEventListener('touchend', touchEnd, false);
		canvasElem.addEventListener('mousedown', mouseStart, false);
		canvasElem.addEventListener('mousemove', mouseMove, false);
		canvasElem.addEventListener('mouseup', mouseUp, false);
		canvasElem.addEventListener('mouseleave', mouseLeave, false);
	});

	onDestroy(() => {
		if (canvasElem) {
			canvasElem.removeEventListener('touchstart', touchStart);
			canvasElem.removeEventListener('touchmove', touchMove);
			canvasElem.removeEventListener('touchend', touchEnd);
			canvasElem.removeEventListener('mousedown', mouseStart);
			canvasElem.removeEventListener('mousemove', mouseMove);
			canvasElem.removeEventListener('mouseup', mouseUp);
			canvasElem.removeEventListener('mouseleave', mouseLeave);
		}
	});
</script>

<div style="transform: translateY({$offset}px);" class="relative h-screen">
	{#each tiles as { letter, done }, i}
		<div class="relative w-12 h-12 mb-1 mr-1 overflow-hidden">
			<div
				class="flex flex-col items-center justify-center w-full h-full
				delay-300
				{done ? 'bg-white bg-opacity-50' : 'bg-secondary'}"
			>
				<p class="uppercase text-2xl">{letter}</p>
			</div>
			<div
				class:translate-y-full={!done}
				class:bg-opacity-50={!$state.matches('completed') &&
					(!highlighted || i != $state.context.rowPositions[index])}
				class="flex flex-col items-center justify-center w-full h-full bg-white
				absolute top-0 duration-300 transition-all"
			>
				<p class="uppercase text-2xl">{letter}</p>
			</div>
		</div>
	{/each}

	<canvas
		style="height: {52 * (tiles.length + 2)}px;"
		bind:this={canvasElem}
		class="absolute w-12 top-0 -translate-y-12"
	/>
</div>
