import React from "react";

export default function SidebarMenu({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  user,
  openModal,
  onLogout,
}) {
  const menuItems = [
    { id: "typing", label: "Practice" },
    { id: "leaderboard", label: "Leaderboard", color: "#fbbf24" },
    { id: "achievements", label: "Achievements", color: "#38bdf8" },
    { id: "friends", label: "Friends", color: "#10b981" },
  ];

  return (
    <>
      {isOpen && <div style={styles.overlay} onClick={onClose} />}

      <div
        style={{
          ...styles.drawer,
          right: isOpen ? "0" : "-35%",
        }}
      >
        <div style={styles.header}>
          <h2 style={styles.drawerTitle}>Menu</h2>

          <button style={styles.closeBtn} onClick={onClose}>
            X
          </button>
        </div>

        <div style={styles.menuList}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              style={{
                ...styles.navBtn,
                color: item.color || "var(--text-main, #fff)",
                background:
                  activeView === item.id
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
              }}
              onClick={() => {
                setActiveView(item.id);
                onClose();
              }}
            >
              {item.label}
            </button>
          ))}

          <hr style={styles.divider} />

          {user ? (
            <>
              <button
                onClick={() => {
                  setActiveView("dashboard");
                  onClose();
                }}
                style={styles.navBtn}
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  onClose();
                  openModal("profile");
                }}
                style={styles.navBtn}
              >
                Profile
              </button>

              <button
                onClick={() => {
                  onClose();
                  openModal("settings");
                }}
                style={styles.navBtn}
              >
                Settings
              </button>

              <button
                onClick={onLogout}
                style={{
                  ...styles.navBtn,
                  color: "#ef4444",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onClose();
                  openModal("auth");
                }}
                style={styles.navBtn}
              >
                Login / Signup
              </button>

              <button
                onClick={() => {
                  onClose();
                  openModal("settings");
                }}
                style={styles.navBtn}
              >
                Settings
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    zIndex: 998,
    backdropFilter: "blur(2px)",
  },

  drawer: {
    position: "fixed",
    top: 0,
    width: "32%",
    minWidth: "260px",
    height: "100%",
    background: "var(--card-bg, #1e293b)",
    color: "var(--text-main, #fff)",
    zIndex: 999,
    transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    padding: "30px 24px",
    boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  drawerTitle: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    margin: 0,
  },

  closeBtn: {
    border: "none",
    background: "none",
    fontSize: "1.4rem",
    cursor: "pointer",
    color: "inherit",
  },

  menuList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
  },

  navBtn: {
    padding: "14px 16px",
    fontSize: "1.1rem",
    textAlign: "left",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.2s",
  },

  divider: {
    border: "0",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    margin: "10px 0",
  },
};