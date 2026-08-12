import React from "react";

export default function RelativeHistogram({
  data = [],
  userScore = 0,
  type = "speed",
}) {
  // Define standard histogram ranges based on WPM or Accuracy
  const buckets =
    type === "speed"
      ? [
          { label: "0-20", min: 0, max: 20 },
          { label: "21-40", min: 21, max: 40 },
          { label: "41-60", min: 41, max: 60 },
          { label: "61-80", min: 61, max: 80 },
          { label: "81-100", min: 81, max: 100 },
          { label: "100+", min: 101, max: 999 },
        ]
      : [
          { label: "<80%", min: 0, max: 80 },
          { label: "80-89%", min: 81, max: 89 },
          { label: "90-94%", min: 90, max: 94 },
          { label: "95-98%", min: 95, max: 98 },
          { label: "99-100%", min: 99, max: 100 },
        ];

  // Calculate distribution frequency across tests or global dataset
  const distribution = buckets.map((bucket) => {
    const count = data.filter(
      (value) => value >= bucket.min && value <= bucket.max
    ).length;

    // Check if the user's overall average score falls inside this bucket
    const isUserBucket =
      userScore >= bucket.min && userScore <= bucket.max;

    return {
      ...bucket,
      count: Math.max(count, 1),
      isUserBucket,
    };
  });

  const maxCount = Math.max(
    ...distribution.map((item) => item.count),
    5
  );

  return (
    <div
      style={{
        width: "100%",
        height: "180px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "20px 10px 10px 10px",
        gap: "12px",
      }}
    >
      {distribution.map((bucket, index) => {
        const heightPercent = (bucket.count / maxCount) * 100;

        return (
          <div
            key={index}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            {/* Histogram Bar */}
            <div
              style={{
                width: "100%",
                height: `${Math.max(heightPercent, 8)}%`,
                background: bucket.isUserBucket
                  ? "var(--accent-color)"
                  : "rgba(255, 255, 255, 0.1)",
                borderRadius: "6px 6px 0 0",
                transition: "height 0.4s ease-out",
                boxShadow: bucket.isUserBucket
                  ? "0 0 15px var(--accent-color)"
                  : "none",
                position: "relative",
              }}
            >
              {/* Highlight Tag on the active user bar */}
              {bucket.isUserBucket && (
                <div
                  style={{
                    position: "absolute",
                    top: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--accent-color)",
                    color: "#000",
                    fontSize: "0.65rem",
                    fontWeight: "bold",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  You
                </div>
              )}
            </div>

            {/* X-Axis Label */}
            <span
              style={{
                fontSize: "0.75rem",
                color: bucket.isUserBucket
                  ? "var(--accent-color)"
                  : "var(--text-muted)",
                fontWeight: bucket.isUserBucket ? "bold" : "normal",
                marginTop: "8px",
              }}
            >
              {bucket.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}