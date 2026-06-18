class TrophiesController {
    constructor(userModel, progressModel, trophiesView) {
        this.userModel = userModel;
        this.progressModel = progressModel;
        this.trophiesView = trophiesView;
    }

    init() {
        this.trophiesView.init(document.body);
        this.loadTrophiesData();
    }

    loadTrophiesData() {
        const user = this.userModel.getUser();
        const progress = this.progressModel.getProgress();

        this.trophiesView.renderTrophies(user, progress);
    }
}

export default TrophiesController;
