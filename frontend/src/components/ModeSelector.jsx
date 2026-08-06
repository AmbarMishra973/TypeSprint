function ModeSelector({
  testMode,

  setTestMode,

  selectedTime,

  setSelectedTime,

  wordLimit,

  setWordLimit
}) {
  return (
    <div className="mode-selector">
      <div className="mode-buttons">
        <button
          className={testMode === "time" ? "active-time" : ""}

          onClick={() => {
            setTestMode("time");
          }}
        >
          Time
        </button>

        <button
          className={testMode === "words" ? "active-time" : ""}

          onClick={() => {
            setTestMode("words");
          }}
        >
          Words
        </button>
      </div>

      {testMode === "time" && (
        <div className="option-buttons">
          {[15, 30, 60, 120].map((seconds) => (
            <button
              key={seconds}

              className={selectedTime === seconds ? "active-time" : ""}

              onClick={() => {
                setSelectedTime(seconds);
              }}
            >
              {seconds}s
            </button>
          ))}
        </div>
      )}

      {testMode === "words" && (
        <div className="option-buttons">
          {[10, 25, 50, 100].map((words) => (
            <button
              key={words}

              className={wordLimit === words ? "active-time" : ""}

              onClick={() => {
                setWordLimit(words);
              }}
            >
              {words}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ModeSelector;
