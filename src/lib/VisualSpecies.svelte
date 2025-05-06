<script lang="ts">
	import type { Species } from 'neat-javascript';

	interface Props {
		species: Species[];
	}

	let { species }: Props = $props();

	let width = 800;
	let height = 400;
	let canvas: HTMLCanvasElement | null = null;

	$effect(() => {
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.clearRect(0, 0, width, height);
				ctx.fillStyle = 'black';
				ctx.fillRect(0, 0, width, height);

				// Draw species background
				species.forEach((specimen, index) => {
					ctx.fillStyle = `hsl(${(index / species.length) * 360}, 100%, 50%)`;
					ctx.fillRect(index * (width / species.length), 0, width / species.length, height);
				});

				// Draw point for each genome
				species.forEach((specimen, index) => {
					const x = index * (width / species.length) + width / species.length / 2;

					// Draw each genome in the species
					specimen.genomes.forEach((genome) => {
						const fitness = genome.fitness;
						const y = height - fitness * height;

						ctx.fillStyle = 'white';
						ctx.beginPath();
						ctx.arc(x, y, 5, 0, Math.PI * 2);
						ctx.fill();
					});

					// Draw the best genome in the species
					const y = height - specimen.bestFitness * height;

					ctx.fillStyle = 'white';
					ctx.strokeStyle = 'black';
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.arc(x, y, 5, 0, Math.PI * 2);
					ctx.fill();
					ctx.stroke();
				});
			}
		}
	});
</script>

<h1>Species ({species.length})</h1>
<canvas bind:this={canvas} {width} {height}></canvas>
