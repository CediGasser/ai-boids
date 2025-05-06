<script lang="ts">
	import { config } from '$lib/neat';
	import { sleep } from '$lib/utils';
	import { type Genome, Population } from 'neat-javascript';

	let bestGenome: Genome | null = $state(null);
	let population: Population = new Population(config);
	let generation = $state(0);

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
		for (generation = 0; generation < config.generations; generation++) {
			// Manually evaluate each genome
			population.genomes.forEach((genome: any) => {
				const res = testGenome(genome);
				genome.fitness = res;
			});

			console.log(population.genomes[0].propagate([0, 1]));

			await sleep(100);

			// Track progress
			bestGenome = population.getBestGenome();
			console.log(`Generation ${generation}: Best fitness = ${bestGenome.fitness}`);

			// Evolve to the next generation
			population.evolve();
		}
	}
</script>

<button onclick={run}> Run NEAT </button>
{#if bestGenome}
	<h1>Best Genome</h1>
	<pre>Generation {generation}: Best fitness = {bestGenome.fitness}</pre>
{/if}
