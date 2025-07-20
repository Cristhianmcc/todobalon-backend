# 🚀 CONFIGURACIÓN COMPLETA TODOBALON BACKEND

## ✅ ¡El proyecto ya está creado!

Tu backend TodoBalon está **listo**, solo falta configurar Supabase y probarlo.

---

## 📋 PASO A PASO PARA TERMINAR LA CONFIGURACIÓN

### **PASO 1: Configurar Supabase** 🗄️

1. **Ve a [supabase.com](https://supabase.com) y crea una cuenta**

2. **Crear nuevo proyecto:**
   - Haz clic en "New Project"
   - Nombre: `todobalon-backend`
   - Database Password: (anota tu contraseña)
   - Región: Elige la más cercana a ti

3. **Obtener credenciales:**
   - Ve a **Settings > API**
   - Copia el **Project URL**
   - Copia la **anon public key**
   - Copia la **service_role key** (⚠️ mantén segura)

### **PASO 2: Ejecutar script SQL** 📊

1. **En tu proyecto de Supabase:**
   - Ve a **SQL Editor**
   - Haz clic en "New query"

2. **Copiar y ejecutar:**
   - Abre el archivo `supabase-setup.sql`
   - Copia todo el contenido
   - Pégalo en el SQL Editor
   - Haz clic en "Run"

3. **Verificar:**
   - Deberías ver las tablas: `users`, `auth_codes`, `sessions`
   - Con algunos datos de ejemplo

### **PASO 3: Actualizar variables de entorno** ⚙️

1. **Edita el archivo `.env`:**

```env
# Reemplaza estos valores con los tuyos de Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_key_aqui

# Cambia esta contraseña por una segura
ADMIN_PASSWORD=tu_password_admin_segura
```

### **PASO 4: Probar el backend** 🧪

1. **Ejecutar servidor:**
```bash
npm run dev
```

2. **Probar health check:**
   - Abre: http://localhost:3000/api/health
   - Deberías ver: `{"status": "OK", "message": "TodoBalon Backend API is running"}`

3. **Probar login con usuario demo:**
```bash
# Con curl (si lo tienes)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"accessCode": "DEMO2025"}'

# O con Postman/Thunder Client
# POST http://localhost:3000/api/auth/login
# Body: {"accessCode": "DEMO2025"}
```

---

## 🌐 PASO 5: CONECTAR CON TU FRONTEND

### **Actualizar tu frontend (TodoBalon):**

1. **Ir a tu proyecto frontend**
2. **Modificar `auth.js`:**

```javascript
// Cambiar la URL de la API
getApiUrl() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api'; // Tu backend local
    } else {
        return 'https://tu-backend.render.com/api'; // Tu backend en producción
    }
}
```

---

## 🚀 PASO 6: DEPLOY EN RENDER (PRODUCCIÓN)

### **Preparar para deploy:**

1. **Subir a GitHub:**
```bash
git init
git add .
git commit -m "TodoBalon Backend - Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/todobalon-backend.git
git push -u origin main
```

2. **Configurar en Render:**
   - Ve a [render.com](https://render.com)
   - "New Web Service"
   - Conecta tu repositorio GitHub
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **Variables de entorno en Render:**
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://todobalon.netlify.app
SUPABASE_URL=tu_url_supabase
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_KEY=tu_service_key
JWT_SECRET=jwt_super_secreto_production
ADMIN_PASSWORD=admin_password_segura
```

---

## 🎯 ENDPOINTS LISTOS PARA USAR

### **📡 APIs Disponibles:**

- `GET /api/health` - Estado del servidor
- `POST /api/auth/login` - Login con código de acceso
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/generate` - Generar código admin
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/stats` - Estadísticas (protegido)

### **🔐 Códigos de prueba incluidos:**
- **Usuario demo:** `DEMO2025`
- **Códigos de autorización:** `AUTH1234`, `AUTH5678`, `DEMO2025`, `TEST1111`
- **Password admin:** `admin123` (¡cámbiala en `.env`!)

---

## 🆘 ¿NECESITAS AYUDA?

### **Problemas comunes:**

1. **Error de URL Supabase:**
   - Verifica que copiaste correctamente la URL
   - Debe ser formato: `https://proyecto.supabase.co`

2. **Error de conexión:**
   - Verifica que las tablas existen en Supabase
   - Ejecuta el script `supabase-setup.sql`

3. **CORS Error:**
   - Verifica `FRONTEND_URL` en `.env`
   - Incluye todas las URLs de tu frontend

### **Testing rápido:**
```bash
# 1. Probar health
curl http://localhost:3000/api/health

# 2. Probar login demo
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"accessCode": "DEMO2025"}'
```

---

## ✨ ¡ESTADO ACTUAL!

✅ **Backend creado y configurado**  
✅ **Estructura de carpetas organizada**  
✅ **API endpoints implementados**  
✅ **Integración Supabase lista**  
✅ **Scripts SQL incluidos**  
✅ **Documentación completa**  
⏳ **Solo falta:** Configurar Supabase y variables

---

## 🎊 ¡Ya casi terminamos!

1. **Configura Supabase** (5 minutos)
2. **Actualiza `.env`** (2 minutos)  
3. **Ejecuta `npm run dev`** (30 segundos)
4. **¡Prueba tu API!** 🚀

**¿Todo listo? ¡Tu sistema de autenticación será imparable!** 💪
