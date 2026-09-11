import React, { useState, useEffect, useRef } from "react";
import { Palette, Check } from "lucide-react";

const themes = [
  { id: "original", name: "Classic Yellow", hex: "#e2b714" },
  { id: "dark", name: "Midnight Dark", hex: "#38bdf8" },
  { id: "cyberpunk", name: "Cyberpunk Neon", hex: "#ff007f" },
  { id: "nord", name: "Nord Frost", hex: "#88c0d0" },
  { id: "sunset", name: "Sunset Orange", hex: "#ff7e5f" },
  { id: "light", name: "Clean Light", hex: "#3b82f6" },
  { id: "matrix", name: "Hacker Terminal", hex: "#4ade80" },
  { id: "dracula", name: "Dracula", hex: "#ff79c6" },
];

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("original");
  const dropdownRef = useRef(null);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("typesprint-theme") || "original";
    applyTheme(savedTheme);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const applyTheme = (themeId) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("typesprint-theme", themeId);
    setIsOpen(false);
  };

  return (
    <div
      className="theme-selector-container"
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      {/* Theme selector button */}
      <button
        className={`icon-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Change Theme"
      >
        <Palette size={20} />
      </button>

      {/* Theme dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "10px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--text-muted)",
            borderRadius: "12px",
            padding: "8px",
            width: "200px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                background:
                  currentTheme === theme.id
                    ? "rgba(255,255,255,0.05)"
                    : "transparent",
                border: "none",
                borderRadius: "8px",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontFamily: "var(--font-ui)",
                fontSize: "0.9rem",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    backgroundColor: theme.hex,
                  }}
                />
                {theme.name}
              </div>

              {currentTheme === theme.id && (
                <Check size={16} color={theme.hex} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;