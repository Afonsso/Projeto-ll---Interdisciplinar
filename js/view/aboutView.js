import ColorSimulator from '../model/components/colorsimulator.js';

class AboutView {
    constructor() {
        this.container = null;
        this.simulator = new ColorSimulator();
    }

    init(container) {
        this.container = container;
    }

    renderColorBlindnessSimulator() {
        const simulatorContainer = document.getElementById('simulator-container');
        if (!simulatorContainer) return;
        this.simulator.mount(simulatorContainer);
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
