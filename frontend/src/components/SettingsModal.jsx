function SettingsModal({ soundEnabled, setSoundEnabled, onClose, onClearStats }) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Settings ⚙️</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "5px", marginBottom: "20px" }}>
          Customize your typing environment
        </p>

        {/* Options List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "left", marginBottom: "25px" }}>
          
          {/* Sound Effect Toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px" }}>
            <div>
              <span style={{ fontWeight: "bold", fontSize: "14px", display: "block" }}>Key Sound Effects</span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Play audio clicks while typing</span>
            </div>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                background: soundEnabled ? "var(--primary-accent)" : "rgba(255,255,255,0.1)",
                color: soundEnabled ? "#000" : "#fff",
                border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px"
              }}
            >
              {soundEnabled ? "ON" : "OFF"}
            </button>
          </div>

        </div>

        <button 
          onClick={onClose} 
          className="restart-btn" 
          style={{ width: "100%", padding: "10px", background: "var(--primary-accent)", color: "#000", fontWeight: "bold", border: "none", cursor: "pointer", borderRadius: "6px" }}
        >
          Save & Close
        </button>

        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

const overlayStyle = { 
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
  background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', 
  alignItems: 'center', zIndex: 1000 
};

const modalStyle = { 
  background: '#181a1b', // Solid opaque background to prevent background text bleed-through
  padding: '30px', 
  borderRadius: '12px', 
  width: '380px', 
  position: 'relative', 
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.8)',
  textAlign: 'center'
};

export default SettingsModal;