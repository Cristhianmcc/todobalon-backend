const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// ====== RUTAS PÚBLICAS ======

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario con código de acceso
 * @access  Public
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @route   POST /api/auth/register
 * @desc    Registro de nuevo usuario con código de autorización
 * @access  Public
 */
router.post('/register', (req, res) => authController.register(req, res));

/**
 * @route   POST /api/auth/generate
 * @desc    Generar código de autorización (solo admin)
 * @access  Public (pero requiere password admin)
 */
router.post('/generate', (req, res) => authController.generateCode(req, res));

// ====== RUTAS PROTEGIDAS ======

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar token JWT
 * @access  Private
 */
router.get('/verify', (req, res) => authController.verifyToken(req, res));

/**
 * @route   GET /api/auth/stats
 * @desc    Obtener estadísticas del sistema
 * @access  Private
 */
router.get('/stats', authMiddleware, (req, res) => authController.getStats(req, res));

// ====== MIDDLEWARE DE ERROR ======

router.use((error, req, res, next) => {
    console.error('Error en rutas de auth:', error);
    
    res.status(500).json({
        success: false,
        message: 'Error interno en el sistema de autenticación'
    });
});

module.exports = router;
