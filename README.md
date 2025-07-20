# 🚀 TodoBalon Backend API

Backend API para el sistema de autenticación de TodoBalon con integración de Supabase.

## 📋 Características

- ✅ **Autenticación JWT** - Tokens seguros con expiración
- ✅ **Base de datos Supabase** - PostgreSQL en la nube
- ✅ **Sistema de códigos** - Códigos de acceso y autorización
- ✅ **Panel de administrador** - Generación de códigos admin
- ✅ **Registro de usuarios** - Sistema completo de registro
- ✅ **Gestión de sesiones** - Control de sesiones activas
- ✅ **CORS configurado** - Comunicación con frontend
- ✅ **Middleware de seguridad** - Helmet, validaciones

## 🛠️ Tecnologías

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Supabase** - Base de datos PostgreSQL
- **JWT** - JSON Web Tokens
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Middleware de seguridad

## 🚀 Instalación y Configuración

### 1. Clonar y configurar proyecto

```bash
# El proyecto ya está creado en esta carpeta
cd todobalon-backend

# Instalar dependencias (ya instaladas)
npm install
```

### 2. Configurar Supabase

1. **Crear proyecto en Supabase:**
   - Ve a [https://supabase.com](https://supabase.com)
   - Crea una cuenta y nuevo proyecto
   - Anota tu URL y API Keys

2. **Crear las tablas necesarias:**

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    access_code VARCHAR(20) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de códigos de autorización
CREATE TABLE auth_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_by VARCHAR(100) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sesiones
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    access_code VARCHAR(20),
    token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_users_access_code ON users(access_code);
CREATE INDEX idx_auth_codes_code ON auth_codes(code);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

### 3. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de Supabase
nano .env
```

**Actualizar el archivo `.env`:**

```env
# Configuración de Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_key_aqui

# Configuración JWT y Admin
JWT_SECRET=tu_jwt_secret_super_seguro
ADMIN_PASSWORD=tu_password_admin_segura
```

### 4. Ejecutar en desarrollo

```bash
# Modo desarrollo con recarga automática
npm run dev

# O modo producción
npm start
```

## 📡 Endpoints API

### **Autenticación Pública**

#### `POST /api/auth/login`
Login con código de acceso
```json
{
  "accessCode": "TB123456"
}
```

#### `POST /api/auth/register`
Registro de nuevo usuario
```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "authCode": "AUTH1234"
}
```

#### `POST /api/auth/generate`
Generar código de autorización (admin)
```json
{
  "adminPassword": "admin123"
}
```

### **Endpoints Protegidos**

#### `GET /api/auth/verify`
Verificar token JWT
```bash
Authorization: Bearer tu_jwt_token
```

#### `GET /api/auth/stats`
Estadísticas del sistema (requiere token)
```bash
Authorization: Bearer tu_jwt_token
```

### **Utilidades**

#### `GET /api/health`
Health check del servidor

#### `GET /`
Información general de la API

## 🗄️ Estructura de Base de Datos

### **Tabla `users`**
```sql
id           SERIAL PRIMARY KEY
name         VARCHAR(255) NOT NULL
email        VARCHAR(255)
access_code  VARCHAR(20) UNIQUE NOT NULL
active       BOOLEAN DEFAULT true
created_at   TIMESTAMP WITH TIME ZONE
```

### **Tabla `auth_codes`**
```sql
id          SERIAL PRIMARY KEY
code        VARCHAR(20) UNIQUE NOT NULL
active      BOOLEAN DEFAULT true
created_by  VARCHAR(100) DEFAULT 'admin'
created_at  TIMESTAMP WITH TIME ZONE
```

### **Tabla `sessions`**
```sql
id          SERIAL PRIMARY KEY
user_id     INTEGER REFERENCES users(id)
access_code VARCHAR(20)
token       TEXT NOT NULL
expires_at  TIMESTAMP WITH TIME ZONE NOT NULL
created_at  TIMESTAMP WITH TIME ZONE
```

## 🔧 Desarrollo

### **Scripts disponibles**

```bash
# Desarrollo con recarga automática
npm run dev

# Producción
npm start

# Testing (pendiente configurar)
npm test
```

### **Estructura del proyecto**

```
src/
├── controllers/     # Controladores de rutas
├── middleware/      # Middleware personalizado
├── routes/          # Definición de rutas
├── services/        # Servicios (Supabase, etc.)
└── index.js         # Archivo principal
```

## 🚀 Deploy en Render

### 1. **Preparar para producción**

Actualizar variables de entorno en Render:

```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://todobalon.netlify.app
SUPABASE_URL=tu_url_production
SUPABASE_ANON_KEY=tu_key_production
SUPABASE_SERVICE_KEY=tu_service_key_production
JWT_SECRET=jwt_secret_super_seguro_production
ADMIN_PASSWORD=admin_password_super_segura
```

### 2. **Configurar en Render**

- **Runtime:** Node.js
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Production

## 🔐 Seguridad

- ✅ **JWT Tokens** con expiración de 24 horas
- ✅ **Helmet** para headers de seguridad
- ✅ **CORS** configurado correctamente
- ✅ **Validación de entrada** en todos los endpoints
- ✅ **Gestión de sesiones** en base de datos
- ✅ **Limpieza automática** de sesiones expiradas

## 🐛 Debugging

### **Logs importantes:**
```bash
# Ver logs en desarrollo
npm run dev

# Logs de conexión Supabase
GET /api/health
```

### **Testing de endpoints:**
```bash
# Test health check
curl http://localhost:3000/api/health

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"accessCode": "TB123456"}'
```

## 📞 Soporte

Para problemas o dudas:
1. Verificar logs del servidor
2. Comprobar configuración de Supabase
3. Validar variables de entorno
4. Revistar conexión de base de datos

---

**🎯 ¡Tu backend está listo para producción!** 🚀
