declare module 'neat-javascript' {
	export type ConfigOptions = {
		inputSize: number;
		outputSize: number;
		activationFunction: string;
		bias: number;
		connectBias: boolean;
		biasMode: string;
		fitnessFunction: string;
		weightInitialization: {
			type: string;
			params: number[];
		};
		c1: number;
		c2: number;
		c3: number;
		compatibilityThreshold: number;
		interspeciesMatingRate: number;
		mutationRate: number;
		weightMutationRate: number;
		addConnectionMutationRate: number;
		addNodeMutationRate: number;
		minWeight: number;
		maxWeight: number;
		reinitializeWeightRate: number;
		minPerturb: number;
		maxPerturb: number;
		populationSize: number;
		generations: number;
		targetFitness: number;
		survivalRate: number;
		numOfElite: number;
		dropOffAge: number;
		populationStagnationLimit: number;
		keepDisabledOnCrossOverRate: number;
		mutateOnlyProb: number;
		allowRecurrentConnections?: boolean; // Optional
		recurrentConnectionRate?: number; // Optional
	};
	export class Config {
		constructor(options: ConfigOptions);
		generations: number;
	}

	export class Population {
		constructor(config: Config);
		genomes: Genome[];
		getBestGenome(): Genome;
		evolve(): void;
	}

	export class Genome {
		fitness: number;
		propagate(input: mumber[]): number[];
	}
}
