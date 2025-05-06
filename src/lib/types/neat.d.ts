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

	export class Species {
		bestFitness: number;
		config: Config;
		generationsSinceImprovement: number;
		genomes: Genome[];
		id: number;
		offspringCount: number;
		stagnated: boolean;
	}

	export class Population {
		constructor(config: Config);
		genomes: Genome[];
		species: Species[];
		populationId: number | string;
		generation: number;
		config: Config;
		evolve(): void;
		evaluatePopulation(): void;
		speciate(): void;
		getBestGenome(): Genome;
	}

	export class Node {
		id: number;
		nodeType: 'INPUT' | 'OUTPUT' | 'HIDDEN' | 'BIAS';
		expectedInputs: number;
	}

	export class Connection {
		id: number;
		enables: boolean;
		forwardExpectedInput: boolean;
		inNode: Node;
		outNode: Node;
		weight: number;
		recurrent: boolean;
		innovationNumber: number;
	}

	// good
	export class Genome {
		constructor(
			nodeGenes: Node[],
			connectionGenes: Connection[],
			config: any,
			populationId: number | string
		);
		id: number;
		nodeGenes: Node[];
		connectionGenes: Connection[];
		inputNodes: Node[];
		outputNodes: Node[];
		biasNode: Node;
		fitness: number;
		populationId: number;
		propagate(input: mumber[]): number[];
		resetState(): void;
		mutate(): void;
		mutateWeights(): void;
		mutateAddConnection(): void;
		mutateAddNode(): void;
		reinitializeWeights(): void;
		copy(): Genome;
		equalsGenome(other: Genome): boolean;
		crossover(other: Genome): Genome;
		evaluateFitness(): void;
		toJSON(): string;
		prune(): void;
	}
}
