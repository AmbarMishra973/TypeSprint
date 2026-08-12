import React, { useState } from "react";

export default function PracticeCalendar({ recentTests = [] }) {
  const [tooltip, setTooltip] = useState(null);

  // Generate the last 30 days array
  const days = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const dateString = d.toISOString().split("T")[0];

    // Count how many tests were completed on this date
    const testsOnDay = recentTests.filter((test) => {
      const testDate = new Date(test.date).toISOString().split("T")[0];
      return testDate === dateString;
    }).length;

    days.push({
      date: dateString,
      count: testsOnDay,
      displayDate: d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    });
  }

  // Determine square color based on activity density
  const getColor = (count) => {
    if (count === 0) return "rgba(255, 255, 255, 0.05)";
    if (count <= 2) return "#065f46";
    if (count <= 5) return "#059669";
    return "#10b981";
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {days.map((day, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setTooltip(day)}
            onMouseLeave={() => setTooltip(null)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            style={{
              width: "100%",
              aspectRatio: "1",
              background: getColor(day.count),
              borderRadius: "4px",
              cursor: "pointer",
              transition: "transform 0.1s ease",
            }}
          />
        ))}
      </div>

      {/* Hover Tooltip Box */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "0.8rem",
            color: "#fff",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            zIndex: 10,
          }}
        >
          <strong>{tooltip.displayDate}</strong>: {tooltip.count} test
          {tooltip.count === 1 ? "" : "s"}
        </div>
      )}

      {/* Legend Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          marginTop: "10px",
        }}
      >
        <span>Less</span>

        <div
          style={{
            width: "10px",
            height: "10px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "2px",
          }}
        />

        <div
          style={{
            width: "10px",
            height: "10px",
            background: "#065f46",
            borderRadius: "2px",
          }}
        />

        <div
          style={{
            width: "10px",
            height: "10px",
            background: "#059669",
            borderRadius: "2px",
          }}
        />

        <div
          style={{
            width: "10px",
            height: "10px",
            background: "#10b981",
            borderRadius: "2px",
          }}
        />

        <span>More</span>
      </div>
    </div>
  );
}