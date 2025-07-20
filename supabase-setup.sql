-- ================================================
-- TODOBALON BACKEND - SCRIPT DE CONFIGURACIÓN SUPABASE
-- ================================================

-- 1. CREAR TABLAS PRINCIPALES
-- ================================================

-- Tabla de usuarios registrados
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    access_code VARCHAR(20) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de códigos de autorización
CREATE TABLE IF NOT EXISTS auth_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_by VARCHAR(100) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sesiones activas
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    access_code VARCHAR(20),
    token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREAR ÍNDICES PARA RENDIMIENTO
-- ================================================

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_users_access_code ON users(access_code);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_auth_codes_code ON auth_codes(code);
CREATE INDEX IF NOT EXISTS idx_auth_codes_active ON auth_codes(active);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- 3. INSERTAR DATOS DE EJEMPLO
-- ================================================

-- Códigos de autorización de ejemplo
INSERT INTO auth_codes (code, active, created_by) VALUES 
    ('AUTH1234', true, 'setup'),
    ('AUTH5678', true, 'setup'),
    ('DEMO2025', true, 'setup'),
    ('TEST1111', true, 'setup')
ON CONFLICT (code) DO NOTHING;

-- Usuario de prueba
INSERT INTO users (name, email, access_code, active) VALUES 
    ('Usuario Demo', 'demo@todobalon.com', 'DEMO2025', true),
    ('Test User', 'test@todobalon.com', 'TEST1111', true)
ON CONFLICT (access_code) DO NOTHING;

-- 4. CONFIGURAR RLS (ROW LEVEL SECURITY) - OPCIONAL
-- ================================================

-- Habilitar RLS en las tablas (opcional para mayor seguridad)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE auth_codes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (descomenta si habilitas RLS)
-- CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (access_code = current_setting('app.current_access_code'));
-- CREATE POLICY "Auth codes are viewable by authenticated users" ON auth_codes FOR SELECT TO authenticated;
-- CREATE POLICY "Sessions are manageable by their owners" ON sessions FOR ALL USING (access_code = current_setting('app.current_access_code'));

-- 5. CREAR FUNCIÓN PARA LIMPIAR SESIONES EXPIRADAS
-- ================================================

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions 
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 6. VERIFICAR INSTALACIÓN
-- ================================================

-- Comprobar que las tablas se crearon correctamente
SELECT 
    'users' as table_name, 
    COUNT(*) as record_count 
FROM users
UNION ALL
SELECT 
    'auth_codes' as table_name, 
    COUNT(*) as record_count 
FROM auth_codes
UNION ALL
SELECT 
    'sessions' as table_name, 
    COUNT(*) as record_count 
FROM sessions;

-- ================================================
-- INSTRUCCIONES FINALES:
-- ================================================
-- 1. Ejecuta este script en tu panel de Supabase (SQL Editor)
-- 2. Verifica que todas las tablas se crearon
-- 3. Anota tu SUPABASE_URL y API Keys
-- 4. Actualiza el archivo .env de tu backend
-- 5. ¡Listo para usar! 🚀
-- ================================================
