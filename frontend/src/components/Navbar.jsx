import { useState } from "react";
import SidebarMenu from "./SidebarMenu";

function Navbar({ activeView, setActiveView, user, openModal }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("typingUser");
    window.location.reload(); 
  };

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'relative' }}>
      <div 
        className="logo" 
        style={{ fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' }} 
        onClick={() => { setActiveView("typing"); }}
      >
        ⌨️ TypeMaster
      </div>

      {/* Hamburger Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        style={{ 
          background: 'none', border: 'none', fontSize: '26px', 
          cursor: 'pointer', color: 'var(--text-main)', padding: '4px 8px' 
        }}
      >
        ☰
      </button>

      {/* Slide-out Sidebar Drawer */}
      <SidebarMenu 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        user={user}
        openModal={openModal}
        onLogout={handleLogout}
      />
    </nav>
  );
}

export default Navbar;