import { useState } from "react";

function Navbar({ activeView, setActiveView, user, openModal }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("typingUser");
    window.location.reload(); // Refresh to reset state back to guest
  };

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'relative' }}>
      <div 
        className="logo" 
        style={{ fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' }} 
        onClick={() => { setActiveView("typing"); setDropdownOpen(false); }}
      >
        ⌨️ TypeMaster
      </div>

      {/* Hamburger Toggle Button */}
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ 
            background: 'none', border: 'none', fontSize: '24px', 
            cursor: 'pointer', color: 'var(--text-main)', padding: '4px 8px' 
          }}
        >
          ☰
        </button>

        {/* Dropdown Menu Container */}
        {dropdownOpen && (
          <div style={{
            position: 'absolute', right: '0', top: '45px', background: 'var(--card-bg)', 
            border: '1px solid var(--text-muted)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            width: '180px', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <button 
              onClick={() => { setActiveView("typing"); setDropdownOpen(false); }} 
              style={menuItemStyle}
            >
              ⌨️ Practice
            </button>

            {user ? (
              <>
                <button 
                  onClick={() => { setActiveView("dashboard"); setDropdownOpen(false); }} 
                  style={menuItemStyle}
                >
                  📊 Dashboard
                </button>
                <button 
  onClick={() => { 
    setDropdownOpen(false); 
    openModal("profile"); 
  }} 
  style={menuItemStyle}
>
  👤 Profile
</button>
                <button 
                  onClick={() => { openModal("settings"); setDropdownOpen(false); }} 
                  style={menuItemStyle}
                >
                  ⚙️ Settings
                </button>
                <button 
                  onClick={handleLogout} 
                  style={{ ...menuItemStyle, color: '#ef4444' }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { openModal("auth"); setDropdownOpen(false); }} 
                  style={menuItemStyle}
                >
                  🔑 Login / Signup
                </button>
                <button 
                  onClick={() => { openModal("settings"); setDropdownOpen(false); }} 
                  style={menuItemStyle}
                >
                  ⚙️ Settings
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

const menuItemStyle = {
  background: '#1e293b', border: 'none', padding: '12px 16px', textAlign: 'left', 
  color: 'var(--text-main)', cursor: 'pointer', width: '100%', fontSize: '14px', 
  borderBottom: '1px solid rgba(255,255,255,0.05)'
};

export default Navbar;