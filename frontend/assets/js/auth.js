/**
 * auth.js
 * Autentikasi: Login, Logout, Session Management
 * SIM-HUMAS Dinas PUPR Papua Barat Daya
 */

const Auth = (() => {

  // ── STATE ─────────────────────────────────────────────────────
  let currentUser = null;

  // ── DEMO USER (jika Supabase belum dikonfigurasi) ─────────────
  const DEMO_USER = {
    id: 'demo-001',
    email: 'admin@pupr-papbd.go.id',
    full_name: 'Admin HUMAS',
    role: 'Administrator',
    initials: 'AD',
  };

  // ── LOGIN ─────────────────────────────────────────────────────
  async function login(email, password) {
    const sb = window.SupabaseConfig?.client();

    if (!sb) {
      // Mode demo: cek kredensial hardcoded
      if (email === 'admin@pupr-papbd.go.id' && password === 'admin123') {
        currentUser = DEMO_USER;
        localStorage.setItem('sim_humas_user', JSON.stringify(DEMO_USER));
        return { success: true, user: DEMO_USER, demo: true };
      }
      return { success: false, error: 'Email atau password salah.' };
    }

    // Mode Supabase
    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error: error.message };
    }

    // Ambil profil pengguna dari tabel `profiles`
    const { data: profile } = await sb
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    currentUser = {
      id: data.user.id,
      email: data.user.email,
      full_name: profile?.full_name || data.user.email,
      role: profile?.role || 'Editor',
      initials: getInitials(profile?.full_name || data.user.email),
    };

    return { success: true, user: currentUser };
  }

  // ── LOGOUT ────────────────────────────────────────────────────
  async function logout() {
    const sb = window.SupabaseConfig?.client();

    if (sb) {
      await sb.auth.signOut();
    }

    currentUser = null;
    localStorage.removeItem('sim_humas_user');
    window.location.href = '../pages/login.html';
  }

  // ── GET CURRENT USER ──────────────────────────────────────────
  async function getCurrentUser() {
    if (currentUser) return currentUser;

    const sb = window.SupabaseConfig?.client();

    if (sb) {
      try {
        const { data: { session }, error: sessionError } = await sb.auth.getSession();
        
        if (sessionError) {
          console.error('[Auth] Error getting session:', sessionError);
        }

        if (session?.user) {
          const { data: profile, error: profileError } = await sb
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.warn('[Auth] Gagal mengambil profile:', profileError);
          }

          currentUser = {
            id: session.user.id,
            email: session.user.email,
            full_name: profile?.full_name || session.user.email,
            role: profile?.role || 'Editor',
            initials: getInitials(profile?.full_name || session.user.email),
          };
          return currentUser;
        } else {
          console.warn('[Auth] Session Supabase tidak ditemukan / null');
        }
      } catch (err) {
        console.error('[Auth] Exception in getCurrentUser:', err);
      }
      return null;
    }

    // Mode demo: cek localStorage
    const stored = localStorage.getItem('sim_humas_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }

    return null;
  }

  // ── REQUIRE AUTH (Guard) ──────────────────────────────────────
  async function requireAuth() {
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.warn('[Auth] Guard: User tidak ditemukan. Mengalihkan ke login...');
        window.location.href = '../pages/login.html?redirected=true';
        return null;
      }
      return user;
    } catch (e) {
      console.error('[Auth] Guard Error:', e);
      window.location.href = '../pages/login.html?error=true';
      return null;
    }
  }

  // ── CHECK AUTH (tanpa redirect) ───────────────────────────────
  async function checkAuth() {
    return await getCurrentUser();
  }

  // ── ON AUTH STATE CHANGE ──────────────────────────────────────
  function onAuthChange(callback) {
    const sb = window.SupabaseConfig?.client();
    if (sb) {
      sb.auth.onAuthStateChange((_event, session) => {
        callback(session?.user || null);
      });
    }
  }

  // ── HELPERS ───────────────────────────────────────────────────
  function getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // ── PUBLIC API ────────────────────────────────────────────────
  return {
    login,
    logout,
    getCurrentUser,
    requireAuth,
    checkAuth,
    onAuthChange,
    getInitials,
  };

})();

window.Auth = Auth;
