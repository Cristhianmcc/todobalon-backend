const { createClient } = require('@supabase/supabase-js');

class SupabaseService {
    constructor() {
        this.supabaseUrl = process.env.SUPABASE_URL;
        this.supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
        this.supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

        if (!this.supabaseUrl || !this.supabaseAnonKey) {
            throw new Error('Configuración de Supabase incompleta');
        }

        // Cliente para operaciones públicas
        this.supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);
        
        // Cliente administrativo para operaciones privilegiadas
        this.adminClient = this.supabaseServiceKey 
            ? createClient(this.supabaseUrl, this.supabaseServiceKey)
            : this.supabase;
    }

    // ====== USUARIOS ======
    
    async getUserByAccessCode(accessCode) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('access_code', accessCode)
                .eq('active', true)
                .single();

            if (error) {
                if (error.code === 'PGRST116') return null; // No rows found
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error getting user by access code:', error);
            throw new Error('Error al buscar usuario');
        }
    }

    async createUser(userData) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .insert([{
                    name: userData.name,
                    email: userData.email || null,
                    access_code: userData.accessCode,
                    active: true,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Error al crear usuario');
        }
    }

    async getAllUsers() {
        try {
            const { data, error } = await this.adminClient
                .from('users')
                .select('id, name, email, access_code, active, created_at')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting all users:', error);
            throw new Error('Error al obtener usuarios');
        }
    }

    async updateUserStatus(accessCode, active) {
        try {
            const { data, error } = await this.adminClient
                .from('users')
                .update({ active })
                .eq('access_code', accessCode)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating user status:', error);
            throw new Error('Error al actualizar estado del usuario');
        }
    }

    // ====== CÓDIGOS DE AUTORIZACIÓN ======
    
    async isValidAuthCode(authCode) {
        try {
            const { data, error } = await this.supabase
                .from('auth_codes')
                .select('*')
                .eq('code', authCode)
                .eq('active', true)
                .single();

            if (error) {
                if (error.code === 'PGRST116') return false; // No rows found
                throw error;
            }

            return true;
        } catch (error) {
            console.error('Error validating auth code:', error);
            return false;
        }
    }

    async createAuthCode(code, createdBy = 'admin') {
        try {
            const { data, error } = await this.adminClient
                .from('auth_codes')
                .insert([{
                    code: code,
                    active: true,
                    created_by: createdBy,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating auth code:', error);
            throw new Error('Error al crear código de autorización');
        }
    }

    async getAllAuthCodes() {
        try {
            const { data, error } = await this.adminClient
                .from('auth_codes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting auth codes:', error);
            throw new Error('Error al obtener códigos de autorización');
        }
    }

    async deactivateAuthCode(code) {
        try {
            const { data, error } = await this.adminClient
                .from('auth_codes')
                .update({ active: false })
                .eq('code', code)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error deactivating auth code:', error);
            throw new Error('Error al desactivar código de autorización');
        }
    }

    // ====== SESIONES ======
    
    async createSession(userId, accessCode, token) {
        try {
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas

            const { data, error } = await this.supabase
                .from('sessions')
                .insert([{
                    user_id: userId,
                    access_code: accessCode,
                    token: token,
                    expires_at: expiresAt.toISOString(),
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating session:', error);
            throw new Error('Error al crear sesión');
        }
    }

    async getActiveSession(token) {
        try {
            const { data, error } = await this.supabase
                .from('sessions')
                .select(`
                    *,
                    users!inner(id, name, email, access_code, active)
                `)
                .eq('token', token)
                .gte('expires_at', new Date().toISOString())
                .single();

            if (error) {
                if (error.code === 'PGRST116') return null; // No rows found
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error getting active session:', error);
            return null;
        }
    }

    async cleanExpiredSessions() {
        try {
            const { error } = await this.supabase
                .from('sessions')
                .delete()
                .lt('expires_at', new Date().toISOString());

            if (error) throw error;
            console.log('✅ Sesiones expiradas limpiadas');
        } catch (error) {
            console.error('Error cleaning expired sessions:', error);
        }
    }

    // ====== UTILIDADES ======
    
    async testConnection() {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('count')
                .limit(1);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error testing Supabase connection:', error);
            return false;
        }
    }
}

module.exports = new SupabaseService();
