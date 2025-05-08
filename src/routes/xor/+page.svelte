<script lang="ts">
	import { config } from './config';
	import { sleep } from '$lib/utils';
	import VisualGenome from '$lib/VisualGenome.svelte';
	import VisualSpecies from '$lib/VisualSpecies.svelte';
	import { type Genome, Population, Species } from 'neat-javascript';

	let population: Population = new Population(config);

	let bestGenome: Genome | null = $state(null);
	let generation = $state(0);
	let species: Species[] = $state([]);
	let speed = $state(0);

	function testGenome(genome: Genome) {
		// Test the genome with some inputs
		const inputs = [
			[0, 1],
			[1, 0],
			[1, 1],
			[0, 0]
		];
		const outputs = inputs.map((input) => genome.propagate(input));

		const expectedOutputs = [[1], [1], [0], [0]];

		let fitness = 1;

		for (let i = 0; i < inputs.length; i++) {
			const output = outputs[i];
			const expectedOutput = expectedOutputs[i];

			const diff = Math.abs(output[0] - expectedOutput[0]);

			// Penalize the fitness based on the difference
			fitness -= diff / 4;
		}

		return fitness;
	}

	async function run() {
		// For each generation
		for (let i = 0; i < config.generations; i++) {
			// Manually evaluate each genome
			population.genomes.forEach((genome: any) => {
				const res = testGenome(genome);
				genome.fitness = res;
			});

			await sleep(speed);

			// Track progress
			bestGenome = population.getBestGenome();
			species = population.species;
			generation = population.generation;

			// Check if the best genome has reached the target fitness
			if (bestGenome && bestGenome.fitness >= config.targetFitness) {
				console.log('Target fitness reached!');
				break;
			}

			// Evolve to the next generation
			population.evolve();
		}
	}
</script>

<h1 class="text-xl">
	Generation {generation}; Fitness = {bestGenome?.fitness}
</h1>
<button onclick={run}> Run NEAT </button>
<input type="range" bind:value={speed} min="0" max="100" step="10" />

<VisualSpecies {species} />

{#if bestGenome}
	<h1>Best Genome</h1>
	<VisualGenome genome={bestGenome} />
{/if}

<style>
	button {
		font-family: monospace;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		padding: 1rem;
		background-color: #f0f0f0;
		cursor: pointer;
	}

	h1 {
		margin-top: 2rem;
	}
</style>
