'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ContentRouter from './ContentRouter';
import { AppRoute, NAV_ITEMS, PATH_TO_ROUTE, ROUTE_TITLES } from '@/app/lib/stylist-shell';
import { ensureSharedAccessToken } from '@/app/lib/accessTokenShare';
import { getAuthSessionToken } from '@/app/lib/authSession';
import { applyPageBackgroundConfig, ensureSavedPageBackgroundConfig, applySurfaceColorConfig, readSurfaceColorConfig } from '@/app/lib/pageBackground';
import { applyTheme, readSavedTheme } from '@/app/lib/theme';
import AddPieceModal from '@/app/components/pieces/AddPieceModal';
import { DiscoverySearchProvider } from '@/app/components/shell/DiscoverySearchContext';
import TopBar from './TopBar';

/* ── Icons ── */
const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75z"/>
    <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75z"/>
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/>
  </svg>
);
const WardrobeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>
  </svg>
);
const CreateIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>
  </svg>
);
const AIIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2l2 5h5l-4 3 1.5 5L12 12l-4.5 3L9 10 5 7h5z"/>
  </svg>
);
const DressIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 4c-2 0-4 1-4 3L6 21h12L16 7c0-2-2-3-4-3z"/>
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
  </svg>
);
const ExploreIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="6"/><path d="m20 20-4.2-4.2"/>
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2m-4.22 7.78-1.42-1.42M5.64 5.64 4.22 4.22"/>
  </svg>
);
const SunIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2m-4.22 7.78-1.42-1.42M5.64 5.64 4.22 4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 7h16M4 12h16M4 17h16"/>
  </svg>
);

/* ── Route → icon / label map (extended with prototype routes) ── */
interface SidebarItem {
  route: AppRoute;
  label: string;
  icon: React.ReactNode;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { route: 'my-wardrobe',      label: 'Guarda-roupa',  icon: <WardrobeIcon /> },
  { route: 'create-my-scheme', label: 'Criar Look',    icon: <CreateIcon /> },
  { route: 'explore-scheme',   label: 'Looks Salvos',  icon: <HeartIcon /> },
  { route: 'dress-tester',     label: 'Provador 2D',   icon: <DressIcon /> },
  { route: 'search-items',     label: 'Explorar',      icon: <ExploreIcon /> },
  { route: 'search-pieces',    label: 'Buscar Peças',  icon: <SearchIcon /> },
  { route: 'profile',          label: 'Perfil',        icon: <HomeIcon /> },
  { route: 'profile-settings', label: 'Configurações', icon: <SettingsIcon /> },
];

export default function HomeShell() {
  const pathname = usePathname();
  const currentRoute: AppRoute = PATH_TO_ROUTE[pathname]
    ?? (pathname.startsWith('/profile/') ? (pathname.endsWith('/settings') ? 'profile-settings' : 'profile') : 'my-wardrobe');

  const [activeRoute, setActiveRoute] = useState<AppRoute>(currentRoute);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [addPieceOpen, setAddPieceOpen] = useState(false);
  const router = useRouter();

  useEffect(() => { setActiveRoute(currentRoute); }, [currentRoute]);

  useEffect(() => {
    const token = getAuthSessionToken();
    if (!token) router.replace('/authview');
  }, [router]);

  useEffect(() => {
    applyPageBackgroundConfig(ensureSavedPageBackgroundConfig());
    applySurfaceColorConfig(readSurfaceColorConfig());
    const saved = readSavedTheme();
    applyTheme(saved);
    setIsDark(saved === 'dark');
  }, []);

  const handleRoute = (route: AppRoute) => {
    setActiveRoute(route);
    const path = NAV_ITEMS.find(i => i.route === route)?.path;
    if (path) router.push(path);
    setMobileOpen(false);
  };

  const toggleDark = () => {
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    setIsDark(!isDark);
    if (typeof window !== 'undefined') localStorage.setItem('sai-theme', next);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    router.replace('/authview');
  };

  const token = getAuthSessionToken();
  if (!token) {
    return (
      <div style={{ display:'flex', minHeight:'100vh', alignItems:'center', justifyContent:'center' }}>
        <div style={{ color: 'var(--muted-foreground)', fontSize:'0.875rem' }}>Verificando acesso...</div>
      </div>
    );
  }

  /* ── Sidebar content ── */
  const SidebarContent = () => (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', padding:'1.5rem 1rem' }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid rgba(255,255,255,0.15)' }}>
        <div style={{
          width:'2.5rem', height:'2.5rem', borderRadius:'0.625rem',
          background:'rgba(255,255,255,0.2)', backdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
        }}>
          <SparklesIcon />
        </div>
        <div>
          <div style={{ color:'#fff', fontWeight:700, fontSize:'1.1rem', lineHeight:1.2 }}>Fashion AI</div>
          <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.75rem' }}>Seu estilista pessoal</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:'0.375rem' }}>
        {SIDEBAR_ITEMS.map(item => {
          const active = activeRoute === item.route;
          return (
            <button
              key={item.route}
              onClick={() => handleRoute(item.route)}
              style={{
                display:'flex', alignItems:'center', gap:'0.75rem',
                padding:'0.75rem 1rem', borderRadius:'0.75rem', border:'none',
                cursor:'pointer', textAlign:'left', width:'100%', transition:'all 0.15s',
                background: active
                  ? 'linear-gradient(120deg,rgba(255,255,255,0.25),rgba(255,255,255,0.12))'
                  : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.7)',
                boxShadow: active ? '0 2px 12px rgba(0,0,0,0.15)' : 'none',
                borderLeft: active ? '3px solid rgba(255,255,255,0.8)' : '3px solid transparent',
              }}
            >
              <span style={{ flexShrink:0, display:'flex' }}>{item.icon}</span>
              <span style={{ fontSize:'0.9rem', fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.15)', paddingTop:'1rem', display:'flex', flexDirection:'column', gap:'0.25rem' }}>
        <button
          onClick={toggleDark}
          style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.625rem 1rem', borderRadius:'0.75rem', border:'none', background:'transparent', color:'rgba(255,255,255,0.7)', cursor:'pointer', width:'100%', textAlign:'left', transition:'all 0.15s' }}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          <span style={{ fontSize:'0.875rem' }}>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>
        <button
          onClick={handleLogout}
          style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.625rem 1rem', borderRadius:'0.75rem', border:'none', background:'transparent', color:'rgba(255,100,100,0.9)', cursor:'pointer', width:'100%', textAlign:'left', transition:'all 0.15s' }}
        >
          <LogOutIcon />
          <span style={{ fontSize:'0.875rem' }}>Sair da Conta</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="sa-home-shell" style={{ display:'flex', minHeight:'100vh' }}>
      {/* ── Sidebar (desktop) ── */}
      <aside
        className="sa-surface-sidebar"
        style={{ width:'16rem', flexShrink:0, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', zIndex:30 }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          style={{ position:'fixed', inset:0, zIndex:40, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="sa-surface-sidebar"
            style={{ width:'16rem', height:'100%', position:'absolute', left:0, top:0 }}
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <DiscoverySearchProvider>
        <main style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
          {/* Topbar */}
          <div style={{ position:'sticky', top:0, zIndex:20 }}>
            <div className="sa-surface-topbar" style={{ padding:'0.875rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(true)}
                style={{ display:'flex', padding:'0.375rem', borderRadius:'0.5rem', border:'none', background:'var(--accent)', color:'var(--foreground)', cursor:'pointer' }}
              >
                <MenuIcon />
              </button>
              <h2 style={{ fontSize:'1.1rem', fontWeight:700, flex:1, margin:0 }}>
                {ROUTE_TITLES[activeRoute]}
              </h2>
              <button
                onClick={() => setAddPieceOpen(true)}
                style={{
                  display:'flex', alignItems:'center', gap:'0.5rem',
                  padding:'0.5rem 1rem', borderRadius:'0.5rem', border:'none',
                  background:'var(--brand-gradient)', color:'#fff', cursor:'pointer',
                  fontSize:'0.875rem', fontWeight:600
                }}
              >
                <span style={{ fontSize:'1.1rem' }}>+</span>
                Adicionar Peça
              </button>
            </div>
          </div>

          {/* Page content */}
          <section style={{ flex:1, overflowY:'auto', padding:'1.5rem' }}>
            <ContentRouter route={activeRoute} />
          </section>
        </main>

        <AddPieceModal open={addPieceOpen} onClose={() => setAddPieceOpen(false)} />
      </DiscoverySearchProvider>
    </div>
  );
}
