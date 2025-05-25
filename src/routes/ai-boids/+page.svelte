<script lang="ts">
	import Sketch from '$lib/Sketch.svelte';
	import p5 from 'p5';
	import { AiBoid } from '$lib/ai-boids';
	import { config } from './config';
	import { Genome, Population, Species } from 'neat-javascript';
	import VisualGenome from '$lib/VisualGenome.svelte';
	import VisualSpecies from '$lib/VisualSpecies.svelte';

	const boids: AiBoid[] = [];
	const PERCEPTION_RADIUS = 50;
	const DANGER_RADIUS = 150;
	const POPULATION_LIFETIME = 300; // 10 seconds

	const population = new Population(config);

	let bestGenome = $state<Genome | null>(null);
	let species = $state<Species[]>([]);
	let generation = $state<number>(0);

	function sketch(p: p5) {
		function reset() {
			boids.length = 0;
			for (const genome of population.genomes) {
				const position = new p5.Vector(p.random(p.width), p.random(p.height));
				const boid = new AiBoid(genome, p, position, PERCEPTION_RADIUS, p.color(0, 0, 250));
				boids.push(boid);
			}
		}

		p.setup = () => {
			p.createCanvas(800, 800);
			reset();
		};

		p.draw = () => {
			p.background(222);
			const dangerZone = new p5.Vector(p.width / 2, p.height / 2);

			// Draw the danger zone
			p.noFill();
			p.stroke(255, 0, 0);
			p.strokeWeight(2);
			p.circle(dangerZone.x, dangerZone.y, DANGER_RADIUS * 2);

			// Draw the time left as circle getting smaller
			p.strokeWeight(1);
			p.circle(
				dangerZone.x,
				dangerZone.y,
				2 * DANGER_RADIUS -
					(p.frameCount % POPULATION_LIFETIME) * ((2 * DANGER_RADIUS) / POPULATION_LIFETIME)
			);

			// Update the boids
			boids.forEach((boid) => {
				const distance = boid
					.wrappedVectorTo(dangerZone)
					.limit(DANGER_RADIUS * 2)
					.div(DANGER_RADIUS);
				boid.update(boids, distance);
			});

			// Draw the boids
			boids.forEach((boid) => {
				boid.draw();
			});

			// Evaluate the fitness of each genome
			// and Evolve the population after a certain number of frames
			if (p.frameCount % POPULATION_LIFETIME === 0) {
				// Update stats
				bestGenome = population.getBestGenome();
				species = population.species;
				generation = population.generation;

				const bestFitness = population.getBestGenome().fitness;
				console.log('Best fitness: ', bestFitness);
				population.evolve();
				console.log('Reset population. Size: ', population.genomes.length);
				reset();
			}
		};
	}
</script>

<main>
	<div class="simulation">
		<Sketch {sketch}></Sketch>

		<div class="flex flex-col gap-4">
			<h2 class="text-2xl font-bold">Best Genome</h2>
			<p>Generation: {generation}</p>
			<p>Fitness: {bestGenome?.fitness}</p>
		</div>
	</div>
	{#if bestGenome}
		<VisualGenome genome={bestGenome} />
	{/if}
	<VisualSpecies {species} />
</main>

<style>
	.simulation {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
