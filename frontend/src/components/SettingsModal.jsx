import React from "react";
import { Volume2, VolumeX, LogOut, Settings, X, Check } from "lucide-react";

function SettingsModal({
  soundEnabled,
  setSoundEnabled,
  onClose,
  onClearStats,
  user,
  onLogout,
}) {
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback manual logout if handler isn't passed
      localStorage.removeItem("typingUser");
      window.location.reload();
    }

    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: "25px", textAlign: "center" }}>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontSize: "1.5rem",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            <Settings size={22} color="var(--accent-color)" />
            Settings
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginTop: "6px",
            }}
          >
            Customize your typing environment and preferences
          </p>
        </div>

        {/* Options List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "30px",
          }}
        >
          {/* Sound Effect Toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--bg-primary)",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textAlign: "left",
              }}
            >
              {soundEnabled ? (
                <Volume2 size={20} color="var(--accent-color)" />
              ) : (
                <VolumeX size={20} color="var(--text-muted)" />
              )}

              <div>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    display: "block",
                  }}
                >
                  Key Sound Effects
                </span>

                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Play audio clicks while typing
                </span>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                background: soundEnabled
                  ? "var(--accent-color)"
                  : "rgba(255,255,255,0.08)",
                color: soundEnabled
                  ? "var(--bg-primary)"
                  : "var(--text-primary)",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.85rem",
                transition: "all 0.2s ease",
              }}
            >
              {soundEnabled ? "ON" : "OFF"}
            </button>
          </div>

          {/* Account / Logout Section */}
          {user && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bg-primary)",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    display: "block",
                  }}
                >
                  Active Session
                </span>

                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--accent-color)",
                  }}
                >
                  Logged in as {user.name}
                </span>
              </div>

              <button
                onClick={handleLogoutClick}
                style={{
                  background: "rgba(202, 71, 84, 0.15)",
                  color: "var(--error-color, #ca4754)",
                  border: "1px solid rgba(202, 71, 84, 0.3)",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Save & Close Button */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            background: "var(--accent-color)",
            color: "var(--bg-primary)",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            borderRadius: "10px",
            fontSize: "1rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "transform 0.2s ease",
          }}
        >
          Save & Close
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.75)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(5px)",
  animation: "fadeIn 0.2s ease-out",
};

const modalStyle = {
  background: "var(--bg-secondary)",
  padding: "30px",
  borderRadius: "18px",
  width: "100%",
  maxWidth: "420px",
  position: "relative",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
  textAlign: "center",
};

export default SettingsModal;