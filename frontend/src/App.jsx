import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Books, ClockCounterClockwise, UploadSimple, SignOut } from '@phosphor-icons/react';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Landing from './components/Landing';
import Login from './components/Login';
import './index.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]); // re-check on nav

  const handleLogout = () => {
    localStorage.removeItem('mockUser');
    setUser(null);
    navigate('/login');
  };

  if (location.pathname === '/' || location.pathname === '/login') {
     return null; // hide sidebar on landing/auth pages
  }

  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>
        <Books size={28} weight="fill" color="var(--primary)" />
        <h2 style={{ fontSize: '1.25rem', margin: 0, fontFamily: 'var(--font-serif)'}}>ScholarInsight</h2>
      </div>
      <nav className="flex flex-col gap-2 px-4">
        <Link 
          to="/dashboard" 
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-sans font-medium hover:bg-surface-container-lowest dark:hover:bg-gray-800/80 ${location.pathname === '/dashboard' ? 'bg-surface-container-lowest dark:bg-gray-800 text-primary dark:text-blue-400 shadow-sm' : 'text-secondary dark:text-gray-400'}`}
        >
          <UploadSimple size={20}/> Upload & Analyze
        </Link>
        <Link 
          to="/history" 
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-sans font-medium hover:bg-surface-container-lowest dark:hover:bg-gray-800/80 ${location.pathname === '/history' ? 'bg-surface-container-lowest dark:bg-gray-800 text-primary dark:text-blue-400 shadow-sm' : 'text-secondary dark:text-gray-400'}`}
        >
          <ClockCounterClockwise size={20} /> Research History
        </Link>
      </nav>

      {/* User Information Footer */}
      <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--outline_variant)', display: 'flex', alignItems: 'center', gap: '12px' }}>
         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface_container_highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase' }}>
               {user?.email ? user.email[0] : 'G'}
            </span>
         </div>
         <div style={{ overflow: 'hidden', flexGrow: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on_surface)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
               {user ? 'Researcher' : 'Guest'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--on_surface_variant)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
               {user?.email || 'Not logged in'}
            </div>
         </div>
         {user && (
           <button 
             onClick={handleLogout} 
             title="Sign Out"
             className="text-on-surface-variant hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-500/10 outline-none flex items-center justify-center border-0 bg-transparent cursor-pointer"
           >
             <SignOut size={20} weight="bold" />
           </button>
         )}
      </div>
    </aside>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main style={{ flex: 1, backgroundColor: 'var(--background)', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const sidebarStyle = {
  width: '280px',
  backgroundColor: 'var(--surface_container_low)',
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem 0',
  boxShadow: '1px 0 0 rgba(196, 198, 207, 0.2)'
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '0 2rem 2rem',
};

export default App;
