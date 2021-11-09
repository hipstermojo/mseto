<main class="bg-primary text-white px-4 min-h-screen">
	<nav class="py-4 flex sticky top-0 w-full justify-center bg-primary">
		<a href="/" title="back to main page" class="absolute left-4 top-6">
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
		<h1 class="text-secondary uppercase font-semibold text-4xl">Mseto</h1>
	</nav>
	<div class="text-lg pt-2 pb-12">
		<slot />
	</div>
</main>
