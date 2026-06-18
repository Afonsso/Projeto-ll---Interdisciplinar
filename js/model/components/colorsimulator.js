class ColorSimulator {
	constructor() {
		this.container = null;
		this.originalImage = null;
		this.currentVisionType = 'protanopia';
		this.originalCanvas = null;
		this.simulatedCanvas = null;
		this.hiddenCanvas = document.createElement('canvas');
		this.hiddenCtx = this.hiddenCanvas.getContext('2d', { willReadFrequently: true });

		this.visionConfig = {
			protanopia: {
				label: 'Protanopia',
				matrix: [
					0.56667, 0.43333, 0.00000,
					0.55833, 0.44167, 0.00000,
					0.00000, 0.24167, 0.75833
				]
			},
			deuteranopia: {
				label: 'Deuteranopia',
				matrix: [
					0.62500, 0.37500, 0.00000,
					0.70000, 0.30000, 0.00000,
					0.00000, 0.30000, 0.70000
				]
			},
			tritanopia: {
				label: 'Tritanopia',
				matrix: [
					0.95000, 0.05000, 0.00000,
					0.00000, 0.43333, 0.56667,
					0.00000, 0.47500, 0.52500
				]
			},
			protanomaly: {
				label: 'Protanomalia',
				matrix: [
					0.81667, 0.18333, 0.00000,
					0.33333, 0.66667, 0.00000,
					0.00000, 0.12500, 0.87500
				]
			},
			deuteranomaly: {
				label: 'Deuteranomalia',
				matrix: [
					0.80000, 0.20000, 0.00000,
					0.25833, 0.74167, 0.00000,
					0.00000, 0.14167, 0.85833
				]
			},
			tritanomaly: {
				label: 'Tritanomalia',
				matrix: [
					0.96667, 0.03333, 0.00000,
					0.00000, 0.73333, 0.26667,
					0.00000, 0.18333, 0.81667
				]
			},
			achromatopsia: {
				label: 'Acromatopsia',
				matrix: [
					0.29900, 0.58700, 0.11400,
					0.29900, 0.58700, 0.11400,
					0.29900, 0.58700, 0.11400
				]
			}
		};
	}

	mount(container) {
		if (!container) return;
		this.container = container;
		this.container.innerHTML = this.getTemplate();
		this.cacheDom();
		this.bindEvents();
	}

	getTemplate() {
		return `
			<section class="simulator-shell" aria-label="Simulador de daltonismo">
				<div class="simulator-head">
					<h2>Simulador de Daltonismo</h2>
					<p>Carrega uma imagem e compara a visao normal com a visao simulada para cada tipo de daltonismo.</p>
				</div>

				<div class="simulator-toolbar">
					<label class="sim-upload" for="sim-upload-input">Carregar imagem</label>
					<input id="sim-upload-input" type="file" accept="image/*" />

					<div class="sim-presets" role="group" aria-label="Imagens exemplo">
						<button type="button" data-preset="../imagens/Fundo_Slide1.jpg">Exemplo 1</button>
						<button type="button" data-preset="../imagens/Fundo_Slide2.jpg">Exemplo 2</button>
						<button type="button" data-preset="../imagens/Fundo_Slide3.jpg">Exemplo 3</button>
					</div>

					<label class="sim-select-wrap" for="sim-vision-type">
						Tipo de visao
						<select id="sim-vision-type">
							<option value="protanopia">Protanopia</option>
							<option value="deuteranopia">Deuteranopia</option>
							<option value="tritanopia">Tritanopia</option>
							<option value="protanomaly">Protanomalia</option>
							<option value="deuteranomaly">Deuteranomalia</option>
							<option value="tritanomaly">Tritanomalia</option>
							<option value="achromatopsia">Acromatopsia</option>
						</select>
					</label>
				</div>

				<div class="sim-status" id="sim-status">Nenhuma imagem carregada.</div>

				<div class="sim-compare-grid">
					<div class="sim-panel">
						<h3>Visao normal</h3>
						<canvas id="sim-normal-canvas" aria-label="Imagem original"></canvas>
					</div>
					<div class="sim-panel">
						<h3 id="simulated-title">Visao simulada - Protanopia</h3>
						<canvas id="sim-simulated-canvas" aria-label="Imagem simulada"></canvas>
					</div>
				</div>
			</section>
		`;
	}

	cacheDom() {
		this.uploadInput = this.container.querySelector('#sim-upload-input');
		this.visionSelect = this.container.querySelector('#sim-vision-type');
		this.statusEl = this.container.querySelector('#sim-status');
		this.simulatedTitle = this.container.querySelector('#simulated-title');
		this.presetButtons = this.container.querySelectorAll('[data-preset]');
		this.originalCanvas = this.container.querySelector('#sim-normal-canvas');
		this.simulatedCanvas = this.container.querySelector('#sim-simulated-canvas');
	}

	bindEvents() {
		if (this.uploadInput) {
			this.uploadInput.addEventListener('change', (event) => {
				const [file] = event.target.files || [];
				if (!file) return;
				this.loadImageFromFile(file);
			});
		}

		if (this.visionSelect) {
			this.visionSelect.addEventListener('change', (event) => {
				this.currentVisionType = event.target.value;
				this.updateSimulatedTitle();
				this.render();
			});
		}

		this.presetButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const url = button.dataset.preset;
				if (url) {
					this.loadImageFromUrl(url);
				}
			});
		});
	}

	async loadImageFromFile(file) {
		const fileReader = new FileReader();
		fileReader.onload = () => {
			const image = new Image();
			image.onload = () => {
				this.originalImage = image;
				this.setStatus(`Imagem carregada: ${file.name}`);
				this.render();
			};
			image.onerror = () => {
				this.setStatus('Nao foi possivel ler a imagem selecionada.');
			};
			image.src = fileReader.result;
		};
		fileReader.onerror = () => {
			this.setStatus('Erro ao processar o ficheiro.');
		};
		fileReader.readAsDataURL(file);
	}

	loadImageFromUrl(url) {
		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.onload = () => {
			this.originalImage = image;
			this.setStatus('Imagem exemplo carregada.');
			this.render();
		};
		image.onerror = () => {
			this.setStatus('Nao foi possivel carregar a imagem exemplo.');
		};
		image.src = url;
	}

	setStatus(message) {
		if (this.statusEl) {
			this.statusEl.textContent = message;
		}
	}

	updateSimulatedTitle() {
		const label = this.visionConfig[this.currentVisionType]?.label || 'Simulada';
		if (this.simulatedTitle) {
			this.simulatedTitle.textContent = `Visao simulada - ${label}`;
		}
	}

	render() {
		if (!this.originalImage || !this.originalCanvas || !this.simulatedCanvas) {
			return;
		}

		const maxWidth = 560;
		const scale = Math.min(1, maxWidth / this.originalImage.width);
		const width = Math.max(1, Math.round(this.originalImage.width * scale));
		const height = Math.max(1, Math.round(this.originalImage.height * scale));

		this.updateSimulatedTitle();

		this.originalCanvas.width = width;
		this.originalCanvas.height = height;
		this.simulatedCanvas.width = width;
		this.simulatedCanvas.height = height;
		this.hiddenCanvas.width = width;
		this.hiddenCanvas.height = height;

		const originalCtx = this.originalCanvas.getContext('2d');
		const simulatedCtx = this.simulatedCanvas.getContext('2d');

		originalCtx.clearRect(0, 0, width, height);
		originalCtx.drawImage(this.originalImage, 0, 0, width, height);

		this.hiddenCtx.clearRect(0, 0, width, height);
		this.hiddenCtx.drawImage(this.originalImage, 0, 0, width, height);

		const imageData = this.hiddenCtx.getImageData(0, 0, width, height);
		const transformed = this.applyVisionMatrix(imageData.data, this.currentVisionType);
		const simulatedData = new ImageData(transformed, width, height);
		simulatedCtx.putImageData(simulatedData, 0, 0);
	}

	applyVisionMatrix(data, visionType) {
		const output = new Uint8ClampedArray(data.length);
		const matrix = this.visionConfig[visionType]?.matrix;

		if (!matrix) {
			output.set(data);
			return output;
		}

		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];

			output[i] = this.clamp(r * matrix[0] + g * matrix[1] + b * matrix[2]);
			output[i + 1] = this.clamp(r * matrix[3] + g * matrix[4] + b * matrix[5]);
			output[i + 2] = this.clamp(r * matrix[6] + g * matrix[7] + b * matrix[8]);
			output[i + 3] = data[i + 3];
		}

		return output;
	}

	clamp(value) {
		return Math.max(0, Math.min(255, Math.round(value)));
	}
}

export default ColorSimulator;
