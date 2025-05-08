import p5 from 'p5';
import { Boid } from '$lib/boids';

const boids: Boid[] = [];
const PERCEPTION_RADIUS = 50;
const NUM_BOIDS = 100;

export default function sketch(p: p5) {
	p.setup = () => {
		p.createCanvas(800, 800);

		for (let i = 0; i < NUM_BOIDS; i++) {
			const position = p.createVector(p.random(p.width), p.random(p.height));
			boids.push(new Boid(p, position, PERCEPTION_RADIUS));
		}
	};

	p.draw = () => {
		p.background(222);

		boids.forEach((boid) => {
			boid.update(boids);
		});

		boids.forEach((boid) => {
			boid.draw();
		});
	};
}
