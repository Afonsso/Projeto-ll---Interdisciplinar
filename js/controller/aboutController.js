
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
}

export default AboutController;
