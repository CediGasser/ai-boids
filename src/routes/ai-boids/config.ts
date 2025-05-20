import { Config } from 'neat-javascript';
// Create a new instance of Config
export const config = new Config({
	// Basic network structure
	inputSize: 8, // Number of input nodes
	outputSize: 2, // Number of output nodes

	// Activation function (string-based selection)
	activationFunction: 'Tanh', // Options: 'Sigmoid', 'NEATSigmoid', 'Tanh', 'ReLU', 'LeakyReLU', 'Gaussian'

	// Bias settings
	bias: 0.0, // Bias value
	connectBias: true, // When true, automatically connects the bias node to all output nodes during network construction
	biasMode: 'WEIGHTED_NODE', // Bias implementation mode

	// Fitness function
	fitnessFunction: 'XOR', // Default XOR fitness function

	// Weight initialization
	weightInitialization: {
		type: 'Random',
		params: [-1, 1] // Min and max values for random weights
	},

	// Network topology parameters
	c1: 1.0, // Coefficient for excess genes
	c2: 1.0, // Coefficient for disjoint genes
	c3: 0.4, // Coefficient for weight differences
	compatibilityThreshold: 3.0, // Species compatibility threshold
	interspeciesMatingRate: 0.001, // Rate of interspecies mating

	// Mutation parameters
	mutationRate: 4.0, // Overall mutation rate
	weightMutationRate: 0.8, // Mutation rate for weights
	addConnectionMutationRate: 0.5, // Rate for adding new connections
	addNodeMutationRate: 0.3, // Rate for adding new nodes
	minWeight: -4.0, // Minimum allowed weight
	maxWeight: 4.0, // Maximum allowed weight
	reinitializeWeightRate: 0.1, // Rate to completely reinitialize weights
	minPerturb: -0.5, // Minimum perturbation value
	maxPerturb: 0.5, // Maximum perturbation value

	// Evolution parameters
	populationSize: 150, // Size of the population
	generations: 1000, // Number of generations
	targetFitness: 0.99, // Target fitness to achieve
	survivalRate: 0.2, // Proportion that survives each generation
	numOfElite: 10, // Number of elite individuals to retain
	dropOffAge: 15, // Maximum age before dropping off
	populationStagnationLimit: 20, // Generations with no improvement before reset
	keepDisabledOnCrossOverRate: 0.75, // Probability of keeping connections disabled during crossover if they are disabled in either parent
	mutateOnlyProb: 0.25, // Probability for mutation-only

	// Recurrent network options
	allowRecurrentConnections: true, // Allow recurrent connections
	recurrentConnectionRate: 1.0 // Rate for recurrent connections
});
