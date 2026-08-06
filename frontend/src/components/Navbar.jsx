function Navbar({ activeView, setActiveView }) {
  return (
    <nav
className="navbar"
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"20px 40px",
position:"relative",
zIndex:10000
}}
>
      <div className="logo" style={{ fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setActiveView("typing")}>
        ⌨️ TypeMaster
      </div>

      <div className="nav-links" style={{ display: 'flex', gap: '20px' }}>
        <button
          onClick={() => setActiveView("typing")}
          style={{
            background: 'none',
            border: 'none',
            color: activeView === "typing" ? 'var(--primary-accent)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Practice
        </button>

        <button
onClick={() => {
    setActiveView("dashboard");
}}

          style={{
            background: 'none',
            border: 'none',
            color: activeView === "dashboard" ? 'var(--primary-accent)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Dashboard 📊
        </button>
      </div>
    </nav>
  );
}

export default Navbar;