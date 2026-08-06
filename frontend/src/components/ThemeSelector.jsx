import { useEffect, useState } from "react";

function ThemeSelector() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "dark";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: '20px', 
        right: '20px', 
        zIndex: 9999    
      }}
    >
      <select 
        value={theme} 
        onChange={(e) => setTheme(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
        
          background: 'var(--card-bg, #1c2128)', 
          color: 'var(--text-main, #c9d1d9)',
          border: '1px solid var(--text-muted, #8b95a5)',
          cursor: 'pointer',
          fontWeight: 'bold',
          outline: 'none',
          width: '140px'
        }}
      >
        <option value="dark" style={{ background: '#1c2128', color: '#c9d1d9' }}>🌙 Dark Mode</option>
        <option value="cyberpunk" style={{ background: '#f4e85c', color: '#111111' }}>🤖 Cyberpunk</option>
        <option value="dracula" style={{ background: '#44475a', color: '#f8f8f2' }}>🧛 Dracula</option>
      </select>
    </div>
  );
}

export default ThemeSelector;