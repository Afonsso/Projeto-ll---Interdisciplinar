import TrophyGallery from '../model/components/trophygallery.js';

class TrophiesView {
	constructor() {
		this.container = null;
		this.trophyGallery = new TrophyGallery();
	}

	init(container) {
		this.container = container;
	}

	renderTrophies(user, progress) {
		const trophiesGrid = document.querySelector('.trophies-grid');
		if (!trophiesGrid) return;

		const trophies = this.trophyGallery.buildTrophies(user, progress);

		trophiesGrid.innerHTML = trophies
			.map((trophy) => this.renderTrophyCard(trophy))
			.join('');
	}

	renderTrophyCard(trophy) {
		const statusClass = trophy.unlocked ? 'unlocked' : 'locked';
		const progressText = trophy.unlocked
			? 'Desbloqueado'
			: `Progresso: ${trophy.progress}`;

		return `
			<div class="trophy-shelf-card ${statusClass}">
				<div class="trophy-display">
					<span class="trophy-avatar">${trophy.icon}</span>
				</div>
				<div class="shelf-wood"></div>
				<h3>${trophy.name}</h3>
				<p>${trophy.description}</p>
				<p>${progressText}</p>
			</div>
		`;
	}
}

export default TrophiesView;
