/**
 * AboutView - Gerencia a renderização da página Sobre
 */
class AboutView {
    constructor() {
        this.container = null;
    }

    // Inicializar a view
    init(container) {
        this.container = container;
    }

    // Renderizar o simulador de daltonismo
    renderColorBlindnessSimulator() {
        const simulatorContainer = document.getElementById('simulator-container');
        if (!simulatorContainer) return;

        simulatorContainer.innerHTML = `
            <div class="simulator-section">
                <h2>Simulador de Daltonismo</h2>
                <p>Carregue uma imagem ou use uma predefinida para ver como é percebida por diferentes tipos de daltonismo.</p>
                
                <div class="simulator-controls">
                    <div class="upload-section">
                        <input type="file" id="image-upload" accept="image/*" class="file-input">
                        <label for="image-upload" class="upload-btn">
                            <span>📁 Carregar Imagem</span>
                        </label>
                    </div>
                    
                    <div class="preset-images">
                        <button class="preset-btn" data-preset="fruits">🍎 Frutas</button>
                        <button class="preset-btn" data-preset="traffic">🚦 Trânsito</button>
                        <button class="preset-btn" data-preset="nature">🌿 Natureza</button>
                    </div>
                </div>

                <div class="simulator-view">
                    <div class="vision-selector">
                        <label for="vision-type">Tipo de Visão:</label>
                        <select id="vision-type">
                            <option value="normal">Visão Normal</option>
                            <option value="protanopia">Protanopia (sem vermelho)</option>
                            <option value="deuteranopia">Deuteranopia (sem verde)</option>
                            <option value="tritanopia">Tritanopia (sem azul)</option>
                            <option value="protanomaly">Protanomalia (vermelho fraco)</option>
                            <option value="deuteranomaly">Deuteranomalia (verde fraco)</option>
                            <option value="tritanomaly">Tritanomalia (azul fraco)</option>
                            <option value="achromatopsia">Acromatopsia (sem cor)</option>
                        </select>
                    </div>

                    <div class="comparison-mode">
                        <label>
                            <input type="radio" name="comparison" value="side-by-side" checked>
                            Lado a Lado
                        </label>
                        <label>
                            <input type="radio" name="comparison" value="slider">
                            Comparador Deslizante
                        </label>
                    </div>

                    <div class="image-display" id="image-display">
                        <div class="image-wrapper normal">
                            <h3>Visão Normal</h3>
                            <div class="placeholder">Carregue uma imagem</div>
                        </div>
                        <div class="image-wrapper simulated">
                            <h3 id="simulated-title">Visão Simulada</h3>
                            <div class="placeholder">Carregue uma imagem</div>
                        </div>
                    </div>
                </div>

                <div class="simulator-info">
                    <div class="info-card">
                        <h4>💡 Dica</h4>
                        <p>Use o comparador deslizante para ver a diferença entre a visão normal e a simulada em tempo real.</p>
                    </div>
                </div>
            </div>
        `;

        this.setupSimulatorEvents();
    }

    // Configurar eventos do simulador
    setupSimulatorEvents() {
        const imageUpload = document.getElementById('image-upload');
        const visionType = document.getElementById('vision-type');
        const comparisonRadios = document.getElementsByName('comparison');
        const presetBtns = document.querySelectorAll('.preset-btn');

        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        if (visionType) {
            visionType.addEventListener('change', (e) => this.applyColorBlindnessFilter(e.target.value));
        }

        comparisonRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.changeComparisonMode(e.target.value));
        });

        presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.loadPresetImage(e.target.dataset.preset));
        });
    }

    // Lidar com upload de imagem
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.displayImages(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    // Carregar imagem predefinida
    loadPresetImage(preset) {
        const presetImages = {
            fruits: '../imagens/Property 1=maçã.png',
            traffic: '../imagens/Fundo_Slide1.jpg',
            nature: '../imagens/Fundo_Slide3.jpg'
        };

        const imagePath = presetImages[preset];
        if (imagePath) {
            this.displayImages(imagePath);
        }
    }

    // Exibir imagens
    displayImages(imageSrc) {
        const normalWrapper = document.querySelector('.image-wrapper.normal');
        const simulatedWrapper = document.querySelector('.image-wrapper.simulated');

        if (normalWrapper && simulatedWrapper) {
            normalWrapper.querySelector('.placeholder').innerHTML = `<img src="${imageSrc}" alt="Imagem normal">`;
            simulatedWrapper.querySelector('.placeholder').innerHTML = `<img src="${imageSrc}" alt="Imagem simulada" id="simulated-image">`;
            
            this.applyColorBlindnessFilter(document.getElementById('vision-type').value);
        }
    }

    // Aplicar filtro de daltonismo
    applyColorBlindnessFilter(type) {
        const simulatedImage = document.getElementById('simulated-image');
        const simulatedTitle = document.getElementById('simulated-title');
        
        if (!simulatedImage) return;

        const filters = {
            normal: 'none',
            protanopia: 'url(#protanopia-filter)',
            deuteranopia: 'url(#deuteranopia-filter)',
            tritanopia: 'url(#tritanopia-filter)',
            protanomaly: 'url(#protanomaly-filter)',
            deuteranomaly: 'url(#deuteranomaly-filter)',
            tritanomaly: 'url(#tritanomaly-filter)',
            achromatopsia: 'grayscale(100%)'
        };

        const titles = {
            normal: 'Visão Normal',
            protanopia: 'Protanopia (sem vermelho)',
            deuteranopia: 'Deuteranopia (sem verde)',
            tritanopia: 'Tritanopia (sem azul)',
            protanomaly: 'Protanomalia (vermelho fraco)',
            deuteranomaly: 'Deuteranomalia (verde fraco)',
            tritanomaly: 'Tritanomalia (azul fraco)',
            achromatopsia: 'Acromatopsia (sem cor)'
        };

        simulatedImage.style.filter = filters[type] || 'none';
        if (simulatedTitle) {
            simulatedTitle.textContent = titles[type] || 'Visão Simulada';
        }
    }

    // Mudar modo de comparação
    changeComparisonMode(mode) {
        const imageDisplay = document.getElementById('image-display');
        if (!imageDisplay) return;

        if (mode === 'slider') {
            imageDisplay.classList.add('slider-mode');
            imageDisplay.classList.remove('side-by-side-mode');
        } else {
            imageDisplay.classList.add('side-by-side-mode');
            imageDisplay.classList.remove('slider-mode');
        }
    }

    // Renderizar tipos de daltonismo
    renderColorBlindnessTypes() {
        const typesContainer = document.querySelector('.tipos-de-daltonismo');
        if (!typesContainer) return;

        const types = [
            {
                name: 'Protanopia',
                description: 'Incapacidade de ver a cor vermelha. Afecta cerca de 1% dos homens.',
                color: '#FF0000'
            },
            {
                name: 'Deuteranopia',
                description: 'Incapacidade de ver a cor verde. Afecta cerca de 1% dos homens.',
                color: '#00FF00'
            },
            {
                name: 'Tritanopia',
                description: 'Incapacidade de ver a cor azul. Muito rara, afecta menos de 0.01% da população.',
                color: '#0000FF'
            },
            {
                name: 'Protanomalia',
                description: 'Sensibilidade reduzida ao vermelho. Forma mais comum de daltonismo.',
                color: '#FF6600'
            },
            {
                name: 'Deuteranomalia',
                description: 'Sensibilidade reduzida ao verde. Afecta cerca de 5% dos homens.',
                color: '#66FF00'
            }
        ];

        typesContainer.innerHTML = types.map(type => `
            <div class="type-card">
                <div class="type-color" style="background-color: ${type.color}"></div>
                <h3>${type.name}</h3>
                <p>${type.description}</p>
            </div>
        `).join('');
    }

    // Inicializar a página Sobre
    initAboutPage() {
        this.renderColorBlindnessSimulator();
        this.renderColorBlindnessTypes();
    }
}

export default AboutView;
