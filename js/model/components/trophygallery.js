class TrophyGallery {
	buildTrophies(user = {}, progress = {}) {
		const worlds = progress.worlds || {};
		const levels = this.getAllLevels(worlds);
		const completedLevels = progress.completedLevels || [];
		const totalWorlds = Object.keys(worlds).length;

		const completedWorlds = Object.values(worlds)
			.filter((world) => world?.completed)
			.length;

		const transitoLevel5 = worlds.transito?.levels?.[5];
		const hasPerfectRun = levels.some((level) => (level?.stars || 0) >= 3);
		const hasFastGameWin = levels.some((level) => {
			return level?.type === 'game' && level?.completed && (level?.stars || 0) >= 3 && (level?.attempts || 0) <= 1;
		});

		const userXp = user?.xp || 0;
		const userStreak = user?.streak || 0;

		return [
			{
				id: 'primeiro_passo',
				name: 'Primeiro Passo',
				description: 'Concluiu o seu primeiro teste com 3 estrelas.',
				icon: '🥇',
				unlocked: hasPerfectRun,
				progress: hasPerfectRun ? '1/1' : `${Math.min(levels.filter((level) => (level?.stars || 0) >= 3).length, 1)}/1`
			},
			{
				id: 'imparavel',
				name: 'Imparável',
				description: 'Alcançou uma sequência de 5 dias ativos.',
				icon: '🔥',
				unlocked: userStreak >= 5,
				progress: `${Math.min(userStreak, 5)}/5 dias`
			},
			{
				id: 'mestre_transito',
				name: 'Mestre do Trânsito',
				description: 'Chegou ao Nível 5 no mundo do Trânsito.',
				icon: '👑',
				unlocked: Boolean(transitoLevel5?.completed),
				progress: `${transitoLevel5?.completed ? 5 : this.getHighestCompletedLevel(worlds.transito?.levels)}/5 níveis`
			},
			{
				id: 'perfeicao',
				name: 'Perfeição',
				description: 'Consiga acumular 5000 XP totais na app.',
				icon: '💎',
				unlocked: userXp >= 5000,
				progress: `${Math.min(userXp, 5000)}/5000 XP`
			},
			{
				id: 'explorador',
				name: 'Explorador',
				description: 'Complete todos os módulos disponíveis.',
				icon: '🚀',
				unlocked: totalWorlds > 0 && completedWorlds === totalWorlds,
				progress: `${completedWorlds}/${totalWorlds || 0} módulos`
			},
			{
				id: 'super_reflexos',
				name: 'Super Reflexos',
				description: 'Termine um desafio em menos de 30 segundos.',
				icon: '⚡',
				unlocked: hasFastGameWin,
				progress: hasFastGameWin
					? '1/1 desafio rápido'
					: `${Math.min(this.countCompletedGameLevels(levels), 1)}/1 desafio rápido`
			}
		];
	}

	getAllLevels(worlds) {
		return Object.values(worlds)
			.flatMap((world) => Object.values(world?.levels || {}));
	}

	getHighestCompletedLevel(levels = {}) {
		return Object.entries(levels)
			.filter(([, level]) => level?.completed)
			.reduce((max, [levelId]) => Math.max(max, Number(levelId) || 0), 0);
	}

	countCompletedGameLevels(levels) {
		return levels.filter((level) => level?.type === 'game' && level?.completed).length;
	}
}

export default TrophyGallery;
