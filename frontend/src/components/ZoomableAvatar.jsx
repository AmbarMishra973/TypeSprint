import React, { useState } from "react";
import { User } from "lucide-react";

export default function ZoomableAvatar({
  avatarUrl,
  name,
  size = 40,
  borderColor = "rgba(255, 255, 255, 0.1)"
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* Small Circular Avatar */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (avatarUrl) setIsFullscreen(true);
        }}
        title={avatarUrl ? "View Picture" : ""}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: `${size * 0.4}px`,
          color: "var(--text-primary)",
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
          cursor: avatarUrl ? "zoom-in" : "default",
          flexShrink: 0
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${name}'s avatar`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : name ? (
          name.charAt(0).toUpperCase()
        ) : (
          <User size={size * 0.5} color="var(--text-muted)" />
        )}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && avatarUrl && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(false);
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            cursor: "zoom-out",
            backdropFilter: "blur(5px)"
          }}
        >
          <img
            src={avatarUrl}
            alt="Fullscreen Avatar"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              animation: "fadeIn 0.2s ease-out"
            }}
          />
        </div>
      )}
    </>
  );
}