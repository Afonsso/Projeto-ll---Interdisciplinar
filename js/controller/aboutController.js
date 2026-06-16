
class AboutController {
    constructor(aboutView) {
        this.aboutView = aboutView;
    }

    // Inicializar o controller
    init() {
        try {
            this.aboutView.init(document.body);
            this.aboutView.initAboutPage();
        } catch (error) {
            console.error('Error initializing about controller:', error);
        }
    }

    // Processar upload de imagem no simulador
    handleImageUpload(file) {
        this.aboutView.handleImageUpload({ target: { files: [file] } });
    }

    // Aplicar filtro de daltonismo
    applyColorBlindnessFilter(type) {
        this.aboutView.applyColorBlindnessFilter(type);
    }

    // Mudar modo de comparação
    changeComparisonMode(mode) {
        this.aboutView.changeComparisonMode(mode);
    }

    // Carregar imagem predefinida
    loadPresetImage(preset) {
        this.aboutView.loadPresetImage(preset);
    }
}

export default AboutController;
