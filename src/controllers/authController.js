const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabaseService = require('../services/supabase');

class AuthController {
    
    // ====== LOGIN ======
    async login(req, res) {
        try {
            const { accessCode } = req.body;

            if (!accessCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Código de acceso requerido'
                });
            }

            // Buscar usuario por código de acceso
            const user = await supabaseService.getUserByAccessCode(accessCode);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Código de acceso inválido'
                });
            }

            if (!user.active) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario inactivo. Contacte al administrador'
                });
            }

            // Generar JWT token
            const token = jwt.sign(
                { 
                    userId: user.id,
                    accessCode: user.access_code,
                    name: user.name 
                },
                process.env.JWT_SECRET || 'todobalon-secret-key',
                { expiresIn: '24h' }
            );

            // Crear sesión en base de datos
            await supabaseService.createSession(user.id, user.access_code, token);

            res.json({
                success: true,
                message: 'Login exitoso',
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    accessCode: user.access_code
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // ====== REGISTRO ======
    async register(req, res) {
        try {
            const { name, email, authCode } = req.body;

            if (!name || !authCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre y código de autorización son requeridos'
                });
            }

            // Validar código de autorización
            const isValidCode = await supabaseService.isValidAuthCode(authCode);
            
            if (!isValidCode) {
                return res.status(401).json({
                    success: false,
                    message: 'Código de autorización inválido'
                });
            }

            // Generar código de acceso único
            const accessCode = this.generateAccessCode();

            // Verificar que el código de acceso no exista
            let existingUser = await supabaseService.getUserByAccessCode(accessCode);
            while (existingUser) {
                accessCode = this.generateAccessCode();
                existingUser = await supabaseService.getUserByAccessCode(accessCode);
            }

            // Crear usuario
            const userData = {
                name: name.trim(),
                email: email?.trim() || null,
                accessCode: accessCode
            };

            const newUser = await supabaseService.createUser(userData);

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                accessCode: accessCode,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            });

        } catch (error) {
            console.error('Error en registro:', error);
            
            if (error.message.includes('duplicate key')) {
                return res.status(409).json({
                    success: false,
                    message: 'El código de acceso ya existe. Intente nuevamente.'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // ====== GENERAR CÓDIGO ADMIN ======
    async generateCode(req, res) {
        try {
            const { adminPassword } = req.body;

            if (!adminPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Contraseña de administrador requerida'
                });
            }

            // Verificar contraseña de admin
            const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';
            
            if (adminPassword !== correctPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña de administrador incorrecta'
                });
            }

            // Generar código de autorización
            const authCode = this.generateAuthCode();

            // Guardar código en base de datos
            await supabaseService.createAuthCode(authCode, 'admin');

            res.json({
                success: true,
                message: 'Código generado exitosamente',
                code: authCode
            });

        } catch (error) {
            console.error('Error generando código:', error);
            
            if (error.message.includes('duplicate key')) {
                // Si hay duplicado, generar nuevo código
                return this.generateCode(req, res);
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // ====== VERIFICAR TOKEN ======
    async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token no proporcionado'
                });
            }

            // Verificar JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'todobalon-secret-key');

            // Verificar sesión activa en base de datos
            const session = await supabaseService.getActiveSession(token);

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: 'Sesión expirada o inválida'
                });
            }

            res.json({
                success: true,
                message: 'Token válido',
                user: {
                    id: session.users.id,
                    name: session.users.name,
                    email: session.users.email,
                    accessCode: session.users.access_code
                }
            });

        } catch (error) {
            console.error('Error verificando token:', error);
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expirado'
                });
            }

            res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
    }

    // ====== UTILIDADES PRIVADAS ======
    
    generateAccessCode() {
        // Generar código de acceso de 8 caracteres alfanuméricos
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'TB'; // Prefijo TodoBalon
        
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    generateAuthCode() {
        // Generar código de autorización de 8 caracteres
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'AUTH';
        
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    // ====== ESTADÍSTICAS ADMIN ======
    async getStats(req, res) {
        try {
            const users = await supabaseService.getAllUsers();
            const authCodes = await supabaseService.getAllAuthCodes();

            const stats = {
                totalUsers: users.length,
                activeUsers: users.filter(u => u.active).length,
                inactiveUsers: users.filter(u => !u.active).length,
                totalAuthCodes: authCodes.length,
                activeAuthCodes: authCodes.filter(c => c.active).length,
                recentUsers: users.slice(0, 5) // Últimos 5 usuarios
            };

            res.json({
                success: true,
                stats: stats
            });

        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

module.exports = new AuthController();
