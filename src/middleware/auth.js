const jwt = require('jsonwebtoken');
const supabaseService = require('../services/supabase');

/**
 * Middleware de autenticación JWT
 * Verifica que el usuario tenga un token válido
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        // Extraer token (formato: "Bearer TOKEN")
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso inválido'
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

        // Verificar que el usuario esté activo
        if (!session.users.active) {
            return res.status(401).json({
                success: false,
                message: 'Usuario inactivo. Contacte al administrador'
            });
        }

        // Agregar información del usuario al request
        req.user = {
            id: session.users.id,
            name: session.users.name,
            email: session.users.email,
            accessCode: session.users.access_code,
            token: token
        };

        next();

    } catch (error) {
        console.error('Error en middleware de autenticación:', error);

        // Manejar errores específicos de JWT
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Inicie sesión nuevamente'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        // Error genérico
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

/**
 * Middleware opcional de autenticación
 * Agrega información del usuario si hay token válido, pero no requiere autenticación
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return next(); // Continúa sin autenticación
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        if (!token) {
            return next(); // Continúa sin autenticación
        }

        // Verificar JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'todobalon-secret-key');

        // Verificar sesión activa en base de datos
        const session = await supabaseService.getActiveSession(token);

        if (session && session.users.active) {
            // Agregar información del usuario al request
            req.user = {
                id: session.users.id,
                name: session.users.name,
                email: session.users.email,
                accessCode: session.users.access_code,
                token: token
            };
        }

        next();

    } catch (error) {
        // En caso de error, continúa sin autenticación
        console.warn('Error en autenticación opcional:', error.message);
        next();
    }
};

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuth;
