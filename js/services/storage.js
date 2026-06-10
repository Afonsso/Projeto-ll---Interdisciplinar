/**
 * Storage Service - Gerencia operações de armazenamento via API json-server
 */
class StorageService {
    constructor() {
        this.apiUrl = 'http://localhost:3000';
    }

    // Obter todos os utilizadores
    async getUsers() {
        try {
            const response = await fetch(`${this.apiUrl}/users`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    // Obter utilizador por email
    async getUserByEmail(email) {
        try {
            const normalizedEmail = email.trim().toLowerCase();
            const response = await fetch(`${this.apiUrl}/users?email=${encodeURIComponent(normalizedEmail)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user by email');
            }
            const users = await response.json();
            return users.length > 0 ? users[0] : null;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            return null;
        }
    }

    // Obter utilizador por ID
    async getUserById(id) {
        try {
            const response = await fetch(`${this.apiUrl}/users/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user by ID');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return null;
        }
    }

    // Adicionar novo utilizador
    async addUser(userData) {
        try {
            // Verificar se o email já existe
            const normalizedEmail = userData.email.trim().toLowerCase();
            const existingUser = await this.getUserByEmail(normalizedEmail);
            if (existingUser) {
                throw new Error('Email já registado');
            }

            // Criar novo utilizador
            const newUser = {
                name: userData.name,
                email: normalizedEmail,
                password: userData.password,
                avatar: userData.avatar || 'property 1=cão.png',
                birthDate: userData.birthDate || null,
                createdAt: new Date().toISOString(),
                colorBlindnessType: null,
                ishiharaCompleted: false,
                xp: 0,
                streak: 0,
                lastLoginDate: null,
                progress: {
                    worlds: {
                        transito: {
                            name: 'Trânsito',
                            emoji: '🚦',
                            unlocked: true,
                            completed: false,
                            bossDefeated: false,
                            levels: {
                                1: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                2: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                3: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                4: { type: 'game', stars: 0, completed: false, attempts: 0 },
                                5: { type: 'game', stars: 0, completed: false, attempts: 0 }
                            }
                        },
                        roupas: {
                            name: 'Roupas & Estilo',
                            emoji: '👚',
                            unlocked: false,
                            completed: false,
                            bossDefeated: false,
                            levels: {
                                1: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                2: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                3: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                4: { type: 'game', stars: 0, completed: false, attempts: 0 },
                                5: { type: 'game', stars: 0, completed: false, attempts: 0 }
                            }
                        },
                        cozinha: {
                            name: 'Cozinha & Alimentação',
                            emoji: '🏡',
                            unlocked: false,
                            completed: false,
                            bossDefeated: false,
                            levels: {
                                1: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                2: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                3: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                4: { type: 'game', stars: 0, completed: false, attempts: 0 },
                                5: { type: 'game', stars: 0, completed: false, attempts: 0 }
                            }
                        },
                        desporto: {
                            name: 'Desporto',
                            emoji: '⚽',
                            unlocked: false,
                            completed: false,
                            bossDefeated: false,
                            levels: {
                                1: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                2: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                3: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                4: { type: 'game', stars: 0, completed: false, attempts: 0 },
                                5: { type: 'game', stars: 0, completed: false, attempts: 0 }
                            }
                        },
                        reflexo: {
                            name: 'Reflexo',
                            emoji: '🏁',
                            unlocked: false,
                            completed: false,
                            bossDefeated: false,
                            levels: {
                                1: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                2: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                3: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
                                4: { type: 'game', stars: 0, completed: false, attempts: 0 },
                                5: { type: 'game', stars: 0, completed: false, attempts: 0 }
                            }
                        }
                    },
                    totalStars: 0,
                    completedLevels: [],
                    recentActivity: []
                }
            };

            const response = await fetch(`${this.apiUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    // Atualizar utilizador
    async updateUser(userId, userData) {
        try {
            const response = await fetch(`${this.apiUrl}/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Remover utilizador
    async deleteUser(userId) {
        try {
            const response = await fetch(`${this.apiUrl}/users/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Criar sessão
    async createSession(userId) {
        try {
            const session = {
                userId: userId,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };

            const response = await fetch(`${this.apiUrl}/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(session)
            });

            if (!response.ok) {
                throw new Error('Failed to create session');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    // Obter sessão por ID
    async getSession(sessionId) {
        try {
            const response = await fetch(`${this.apiUrl}/sessions/${sessionId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch session');
            }

            const session = await response.json();
            
            // Verificar se a sessão não expirou
            if (session && new Date(session.expiresAt) < new Date()) {
                await this.deleteSession(sessionId);
                return null;
            }

            return session;
        } catch (error) {
            console.error('Error fetching session:', error);
            return null;
        }
    }

    // Remover sessão
    async deleteSession(sessionId) {
        try {
            const response = await fetch(`${this.apiUrl}/sessions/${sessionId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete session');
            }

            return true;
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error;
        }
    }

    // Remover todas as sessões de um utilizador
    async deleteUserSessions(userId) {
        try {
            const response = await fetch(`${this.apiUrl}/sessions?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user sessions');
            }

            const sessions = await response.json();
            
            // Remover cada sessão
            for (const session of sessions) {
                await this.deleteSession(session.id);
            }

            return true;
        } catch (error) {
            console.error('Error deleting user sessions:', error);
            throw error;
        }
    }
}

export default StorageService;
