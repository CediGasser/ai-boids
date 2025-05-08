import p5 from 'p5';

const MAX_SPEED = 4;

const SEPARATION_FACTOR = 1.2; // Factor to control the strength of separation behavior
const ALIGNMENT_FACTOR = 0.2; // Factor to control the strength of alignment behavior
const COHESION_FACTOR = 1.2; // Factor to control the strength of cohesion behavior

const AGILITY = 0.1; // Factor to control the agility of the boids
const IGNORE_OTHER_SPECIES = true; // If true, boids will ignore other species

export class Boid {
	private p: p5;
	private velocity: p5.Vector;
	private perceptionRadius: number;

	public species: p5.Color;
	public position: p5.Vector;

	constructor(
		p: p5,
		position: p5.Vector,
		perceptionRadius: number,
		color: p5.Color,
		initVelocity?: p5.Vector
	) {
		this.p = p;
		this.position = position;
		this.perceptionRadius = perceptionRadius;
		this.species = color;

		this.velocity =
			initVelocity ||
			this.p
				.createVector(this.p.random(-1, 1), this.p.random(-1, 1))
				.setMag(this.p.random(2, MAX_SPEED));
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
	public update(boids: Boid[]) {
		let alignment = this.p.createVector(0, 0);
		let cohesion = this.p.createVector(0, 0);
		let separation = this.p.createVector(0, 0);
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

		this.velocity.add(this.calculateMovement(alignment, cohesion, separation)).limit(MAX_SPEED);
		this.position.add(this.velocity);
		this.wrapAround();
	}

	public calculateMovement(alignment: p5.Vector, cohesion: p5.Vector, separation: p5.Vector) {
		let steering = this.p.createVector(0, 0);
		steering.add(alignment.mult(ALIGNMENT_FACTOR)); // Invert alignment to steer towards neighbors
		steering.add(cohesion.mult(COHESION_FACTOR)); // Invert cohesion to steer towards neighbors
		steering.add(separation.mult(SEPARATION_FACTOR)); // Invert separation to steer away from neighbors

		steering.mult(AGILITY); // Limit the steering force to avoid sudden changes in direction
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
	private wrappedDistanceTo(other: Boid) {
		const dx = Math.abs(this.position.x - other.position.x);
		const dy = Math.abs(this.position.y - other.position.y);

		const wrappedDx = Math.min(dx, this.p.width - dx);
		const wrappedDy = Math.min(dy, this.p.height - dy);

		return Math.sqrt(wrappedDx ** 2 + wrappedDy ** 2);
	}
}
