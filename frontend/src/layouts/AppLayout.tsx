import { Link, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { UserRole } from '@leadfinder/shared/types/user';
import { ROLES } from "@leadfinder/shared/types/user";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  matchPattern?: string; // para resaltar el item activo en rutas dinámicas
  hideUnlessMatched?: boolean; // solo se muestra cuando estás dentro del matchPattern
}

const IconDashboard = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconLeads = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconMap = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const IconCard = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconLogout = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" /><path d="M20 12h2" />
    <path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" />
  </svg>
);

const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard',  icon: <IconDashboard />, roles: [ROLES.director] },
  { path: '/leads',     label: 'Leads',      icon: <IconLeads />,    roles: [ROLES.director, ROLES.supervisor, ROLES.representante] },
  { path: '/mapa',      label: 'Mapa',       icon: <IconMap />,      roles: [ROLES.director, ROLES.supervisor, ROLES.representante] },
  // Item dinámico: solo aparece cuando estás dentro de una ficha
  { path: '#', label: 'Ficha CUIT', icon: <IconCard />, roles: [ROLES.director, ROLES.supervisor, ROLES.representante],
    matchPattern: '/leads/:id', hideUnlessMatched: true },
];

const ROLE_LABEL: Record<UserRole, string> = {
  director:      'Director Comercial',
  supervisor:    'Supervisor',
  representante: 'Representante',
};

const PAGE_INFO: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Dashboard ejecutivo' },
  '/leads':     { title: 'Listado de Leads' },
  '/mapa':      { title: 'Mapa de leads', subtitle: 'Visualización geográfica de CUITs prospectables' },
};

const getPageInfo = (pathname: string): { title: string; subtitle?: string } => {
  if (matchPath('/leads/:id', pathname)) {
    return { title: 'Ficha del CUIT' };
  }
  return PAGE_INFO[pathname] ?? { title: 'Lead Finder' };
};

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isInFicha = !!matchPath('/leads/:id', location.pathname);

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!user?.role || !item.roles.includes(user.role)) return false;
    if (item.hideUnlessMatched && !isInFicha) return false;
    return true;
  });

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  const pageInfo = getPageInfo(location.pathname);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px', flexShrink: 0,
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Brand */}
        <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <Link to={user?.role === ROLES.director ? '/dashboard' : '/leads'} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Lead Finder" style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0, display: 'block' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>Lead Finder</span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {visibleItems.map((item) => {
            const isActive = item.matchPattern
              ? !!matchPath(item.matchPattern, location.pathname)
              : location.pathname === item.path;
            const targetPath = item.matchPattern && item.hideUnlessMatched ? location.pathname : item.path;
            return (
              <Link key={item.label} to={targetPath} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '13px', fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--color-green)' : 'var(--color-text-sec)',
                background: isActive ? 'var(--color-green-bg)' : 'transparent',
                transition: 'background 0.15s, color 0.15s',
              }}>
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ padding: '8px 10px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'var(--color-green-bg)', color: 'var(--color-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 600, flexShrink: 0,
            }}>
              {[user?.nombre, user?.apellido].filter(Boolean).map((n) => n![0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-sec)', marginTop: '1px' }}>
                {user?.role ? ROLE_LABEL[user.role] : ''}
              </div>
            </div>
          </div>
          {/* Toggle de modo claro/oscuro */}
          <button onClick={toggleTheme} style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            width: '100%', padding: '8px 10px', borderRadius: '8px',
            border: 'none', background: 'transparent',
            color: 'var(--color-text-sec)', fontSize: '12px', cursor: 'pointer',
            fontFamily: "'Inter', system-ui, sans-serif",
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-card-hover)'; e.currentTarget.style.color = 'var(--color-text)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-sec)'; }}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
            {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </button>

          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            width: '100%', padding: '8px 10px', borderRadius: '8px',
            border: 'none', background: 'transparent',
            color: 'var(--color-text-sec)', fontSize: '12px', cursor: 'pointer',
            fontFamily: "'Inter', system-ui, sans-serif",
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(224,82,82,0.08)'; e.currentTarget.style.color = '#ff7b7b'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-sec)'; }}
          >
            <IconLogout />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{
          minHeight: '56px', background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', padding: '10px 24px', flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
              {pageInfo.title}
            </h1>
            {pageInfo.subtitle && (
              <p style={{ fontSize: '11px', color: 'var(--color-text-sec)', margin: '2px 0 0 0' }}>
                {pageInfo.subtitle}
              </p>
            )}
          </div>
        </header>
        <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
