import p5 from 'p5';
import { Boid } from '$lib/boids';

const boids: Boid[] = [];
const PERCEPTION_RADIUS = 50;
const NUM_BOIDS = 100;

export default function sketch(p: p5) {
	p.setup = () => {
		p.createCanvas(800, 800);

		const RED = p.color(255, 0, 0);
		const GREEN = p.color(0, 200, 0);
		const BLUE = p.color(0, 0, 255);
		const PINK = p.color(255, 0, 255);
		const colors = [RED, GREEN, BLUE, PINK];

		for (let i = 0; i < NUM_BOIDS; i++) {
			const position = p.createVector(p.random(p.width), p.random(p.height));
			boids.push(new Boid(p, position, PERCEPTION_RADIUS, colors[i % colors.length]));
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
