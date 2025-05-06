<script lang="ts">
	import type { Genome, Node } from 'neat-javascript';

	interface Props {
		genome: Genome;
	}

	const DRAW_PADDING = 50;

	let { genome }: Props = $props();

	let width = 800;
	let height = 400;
	let canvas: HTMLCanvasElement | null = null;

	// Function to convert an id to a number between 0 and 1
	function hashToNumber(hash: number): number {
		const str = hash.toString();
		let num = 0;
		for (let i = 0; i < str.length; i++) {
			num += str.charCodeAt(i);
		}
		return (num % 100) / 100;
	}

	function getCanvasNode(node: Node, genome: Genome): { x: number; y: number; color: string } {
		const inputNodeCount = genome.inputNodes.length;
		const outputNodeCount = genome.outputNodes.length;
		let x = Math.random() * width;
		let y = Math.random() * height;
		let color = 'gray';
		switch (node.nodeType) {
			case 'INPUT':
				color = 'green';
				x = DRAW_PADDING;
				y = (height / (inputNodeCount + 1)) * (genome.inputNodes.indexOf(node) + 1);
				break;
			case 'OUTPUT':
				color = 'red';
				x = width - DRAW_PADDING;
				y = (height / (outputNodeCount + 1)) * (genome.outputNodes.indexOf(node) + 1);
				break;
			case 'HIDDEN':
				color = 'blue';
				x = hashToNumber(node.id) * (width - 4 * DRAW_PADDING) + 2 * DRAW_PADDING;
				y = hashToNumber(node.id) * (height - 4 * DRAW_PADDING) + 2 * DRAW_PADDING;
				break;
			default:
				x = hashToNumber(node.id) * (width - 4 * DRAW_PADDING) + 2 * DRAW_PADDING;
				y = hashToNumber(node.id) * (height - 4 * DRAW_PADDING) + 2 * DRAW_PADDING;
				color = 'gray';
		}

		return { x, y, color };
	}

	$effect(() => {
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.clearRect(0, 0, width, height);
				ctx.fillStyle = 'black';
				ctx.fillRect(0, 0, width, height);

				// Draw genome background
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, width, height);

				// Draw genome nodes
				console.log(genome);
				genome.nodeGenes.forEach((node) => {
					let { x, y, color } = getCanvasNode(node, genome);
					ctx.fillStyle = color;
					console.log(node);
					ctx.beginPath();
					ctx.arc(x, y, 5, 0, Math.PI * 2);
					ctx.fill();
				});

				// Draw genome connections
				genome.connectionGenes.forEach((connection) => {
					console.log(connection);
					const fromNode = connection.inNode;
					const toNode = connection.outNode;

					if (fromNode && toNode) {
						const { x: x1, y: y1 } = getCanvasNode(fromNode, genome);
						const { x: x2, y: y2 } = getCanvasNode(toNode, genome);

						ctx.strokeStyle = 'black';
						ctx.lineWidth = 1;
						ctx.beginPath();

						ctx.moveTo(x1, y1);
						ctx.lineTo(x2, y2);
						ctx.stroke();
						ctx.fillStyle = 'black';
						ctx.beginPath();
						ctx.arc(x2, y2, 5, 0, Math.PI * 2);
						ctx.fill();
					}
				});
			}
		}
	});
</script>

<div>
	<h2>({genome.id}) Fitness = {genome.fitness}</h2>
	<canvas bind:this={canvas} {width} {height}></canvas>
</div>

<style>
	div {
		font-family: monospace;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		padding: 1rem;
	}
</style>
