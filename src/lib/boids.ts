import p5 from 'p5';

const PERCEPTION_RADIUS = 50;
const MAX_SPEED = 4;

export class Boid {
	private p: p5;
	public position: p5.Vector;
	private velocity: p5.Vector;
	private perceptionRadius: number;

	constructor(p: p5, position: p5.Vector, perceptionRadius: number, initVelocity?: p5.Vector) {
		this.p = p;
		this.position = position;
		this.perceptionRadius = perceptionRadius;

		this.velocity =
			initVelocity ||
			this.p
				.createVector(this.p.random(-1, 1), this.p.random(-1, 1))
				.setMag(this.p.random(2, MAX_SPEED));
	}

	// Draws a triangle at the boid's position
	public draw() {
		this.p.fill(0);
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
			if (other !== this) {
				let distance = this.wrappedDistanceTo(other);
				if (distance < this.perceptionRadius) {
					alignment.add(other.velocity);
					cohesion.add(other.position);
					separation.add(p5.Vector.sub(this.position, other.position).div(distance));
					total++;
				}
			}
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
		steering.add(alignment);
		steering.add(cohesion);
		steering.add(separation);
		steering.limit(MAX_SPEED / 4); // Limit the steering force to avoid sudden changes in speed
		steering.limit(0.1); // Limit the steering force to avoid sudden changes in direction
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
