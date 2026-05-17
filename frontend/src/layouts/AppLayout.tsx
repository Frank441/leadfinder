import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '@leadfinder/shared/test';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const IconDashboard = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconLeads = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconLogout = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard',     icon: <IconDashboard />, roles: ['director'] },
  { path: '/leads',     label: 'Leads / CUITs', icon: <IconLeads />,    roles: ['director', 'supervisor', 'representante'] },
];

const ROLE_LABEL: Record<UserRole, string> = {
  director:      'Director Comercial',
  supervisor:    'Supervisor',
  representante: 'Representante',
};

const PAGE_TITLE: Record<string, string> = {
  '/dashboard': 'Dashboard ejecutivo',
  '/leads':     'Listado de CUITs',
};

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter(
    (item) => user?.role && item.roles.includes(user.role),
  );

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  const pageTitle = PAGE_TITLE[location.pathname] ?? 'Lead Finder';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0b1929', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: '200px', flexShrink: 0,
        background: '#111f30',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Brand */}
        <div style={{ padding: '18px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#1aaa6e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>LF</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f0f4f8' }}>Lead Finder</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '9px',
                padding: '8px 10px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '13px', fontWeight: isActive ? 500 : 400,
                color: isActive ? '#1aaa6e' : '#7a9bbf',
                background: isActive ? 'rgba(26,170,110,0.12)' : 'transparent',
                transition: 'background 0.15s, color 0.15s',
              }}>
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ padding: '8px 10px', marginBottom: '2px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#f0f4f8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name ?? 'Usuario'}
            </div>
            <div style={{ fontSize: '11px', color: '#7a9bbf', marginTop: '2px' }}>
              {user?.role ? ROLE_LABEL[user.role] : ''}
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            width: '100%', padding: '8px 10px', borderRadius: '8px',
            border: 'none', background: 'transparent',
            color: '#3d5a73', fontSize: '13px', cursor: 'pointer',
            fontFamily: "'Inter', system-ui, sans-serif",
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(224,82,82,0.08)'; e.currentTarget.style.color = '#ff7b7b'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3d5a73'; }}
          >
            <IconLogout />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{
          height: '56px', background: '#111f30',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', padding: '0 24px', flexShrink: 0,
        }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f4f8', margin: 0 }}>
            {pageTitle}
          </h1>
        </header>
        <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
