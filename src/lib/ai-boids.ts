import type { Genome } from 'neat-javascript';
import p5 from 'p5';

const MAX_SPEED = 4;

const SEPARATION_FACTOR = 1.2; // Factor to control the strength of separation behavior
const ALIGNMENT_FACTOR = 0.2; // Factor to control the strength of alignment behavior
const COHESION_FACTOR = 1.2; // Factor to control the strength of cohesion behavior

const AGILITY = 0.1; // Factor to control the agility of the boids
const IGNORE_OTHER_SPECIES = false; // If true, boids will ignore other species

export class AiBoid {
	private p: p5;
	private velocity: p5.Vector;
	private perceptionRadius: number;
	private fitnessRecord: number[] = [];

	public genome: Genome;
	public species: p5.Color;
	public position: p5.Vector;

	constructor(
		genome: Genome,
		p: p5,
		position: p5.Vector,
		perceptionRadius: number,
		color: p5.Color,
		initVelocity?: p5.Vector
	) {
		this.genome = genome;
		this.p = p;
		this.position = position;
		this.perceptionRadius = perceptionRadius;
		this.species = color;

		this.velocity =
			initVelocity ||
			new p5.Vector(this.p.random(-1, 1), this.p.random(-1, 1)).setMag(this.p.random(2, MAX_SPEED));
	}

	public getAverageFitness() {
		if (this.fitnessRecord.length === 0) return 0;
		return this.fitnessRecord.reduce((a, b) => a + b) / this.fitnessRecord.length;
	}

	// Draws a triangle at the boid's position
	public draw() {
		this.p.fill(this.species);
		this.p.noStroke();
		this.p.push();
		this.p.translate(this.position.x, this.position.y);
		this.p.rotate(this.velocity.heading());
		this.p.triangle(-5, -5, -5, 5, 10, 0);
		this.p.pop();
	}

	// Calculates the alignment, cohesion, and separation and executes the movement calculation
	public update(boids: AiBoid[], avoidance: p5.Vector) {
		let alignment = new p5.Vector(0, 0);
		let cohesion = new p5.Vector(0, 0);
		let separation = new p5.Vector(0, 0);
		let total = 0;

		for (let other of boids) {
			if (IGNORE_OTHER_SPECIES && other.species !== this.species) continue;
			if (other === this) continue;
			let distance = this.wrappedDistanceTo(other);
			if (distance > this.perceptionRadius) continue;

			alignment.add(other.velocity);
			cohesion.add(other.position);
			separation.add(p5.Vector.sub(this.position, other.position).div(distance));
			total++;
		}

		if (total > 0) {
			alignment.div(total).setMag(MAX_SPEED);
			cohesion.div(total).sub(this.position).setMag(MAX_SPEED);
			separation.div(total).setMag(MAX_SPEED);
		}

		let normalSteering = this.calculateMovement(alignment, cohesion, separation);
		let aiSteering = this.AICalculateMovement(alignment, cohesion, separation, avoidance);

		this.fitnessRecord.push(this.calculateFitness(normalSteering, aiSteering, avoidance));
		this.genome.fitness = this.getAverageFitness();

		this.velocity.add(aiSteering).limit(MAX_SPEED);
		this.position.add(this.velocity);
		this.wrapAround();
	}

	// Calculate the fitness based on the difference between normal and AI steering and
	// how well the boid avoids obstacles
	private calculateFitness(
		normalSteering: p5.Vector,
		aiSteering: p5.Vector,
		avoidance: p5.Vector
	): number {
		console.log(
			`Normal Steering: ${normalSteering}, AI Steering: ${aiSteering}, Avoidance: ${avoidance}`
		);
		const dot = p5.Vector.dot(normalSteering, aiSteering);
		const mag = normalSteering.mag() * aiSteering.mag();
		const angleDifference = Math.abs(dot / (mag + 0.0001)); // Avoid division by zero
		const magnitudeDifference = Math.abs(normalSteering.mag() - aiSteering.mag());
		const avoidanceMagnitude = 1 - Math.min(avoidance.mag() / 2, 1); // Invert the magnitude for fitness calculation

		const fitness =
			1 -
			angleDifference * 0.2 - // Weight for steering difference
			magnitudeDifference * 0.2 - // Weight for magnitude difference
			avoidanceMagnitude * 0.6; // Weight for avoidance magnitude

		// console.log(
		//	`Fitenss: ${fitness} (Angle: ${angleDifference}, Magnitude: ${magnitudeDifference}, Avoidance: ${avoidanceMagnitude})`
		// );

		return fitness; // Invert the fitness value to make it higher for better performance
	}

	private AICalculateMovement(
		alignment: p5.Vector,
		cohesion: p5.Vector,
		separation: p5.Vector,
		avoidance: p5.Vector // Avoidance vector for obstacles
	): p5.Vector {
		const [x, y] = this.genome.propagate([
			alignment.x / 2 + 0.5,
			alignment.y / 2 + 0.5,
			cohesion.x / 2 + 0.5,
			cohesion.y / 2 + 0.5,
			separation.x / 2 + 0.5,
			separation.y / 2 + 0.5,
			avoidance.x / 2 + 0.5,
			avoidance.y / 2 + 0.5
		]);

		const steering = new p5.Vector(2 * x - 1, 2 * y - 1); // Scale to [-1, 1]
		steering.mult(AGILITY); // multiply by agility factor
		steering.limit(1); // Limit the steering force to avoid sudden changes in direction

		return steering;
	}

	private calculateMovement(
		alignment: p5.Vector,
		cohesion: p5.Vector,
		separation: p5.Vector
	): p5.Vector {
		let steering = new p5.Vector(0, 0);
		steering.add(alignment.copy().mult(ALIGNMENT_FACTOR)); // Invert alignment to steer towards neighbors
		steering.add(cohesion.copy().mult(COHESION_FACTOR)); // Invert cohesion to steer towards neighbors
		steering.add(separation.copy().mult(SEPARATION_FACTOR)); // Invert separation to steer away from neighbors

		steering.mult(AGILITY); // multiply by agility factor
		steering.limit(1); // Limit the steering force to avoid sudden changes in direction

		return steering;
	}

	private wrapAround() {
		if (this.position.x > this.p.width) {
			this.position.x = 0;
		} else if (this.position.x < 0) {
			this.position.x = this.p.width;
		}
		if (this.position.y > this.p.height) {
			this.position.y = 0;
		} else if (this.position.y < 0) {
			this.position.y = this.p.height;
		}
	}

	// Calculate the distance to another boid, considering wrapping around the edges
	private wrappedDistanceTo(other: AiBoid) {
		const dx = Math.abs(this.position.x - other.position.x);
		const dy = Math.abs(this.position.y - other.position.y);

		const wrappedDx = Math.min(dx, this.p.width - dx);
		const wrappedDy = Math.min(dy, this.p.height - dy);

		return Math.sqrt(wrappedDx ** 2 + wrappedDy ** 2);
	}
}
