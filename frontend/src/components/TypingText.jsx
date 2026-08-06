function TypingText({ paragraph, typedText }) {
  return (
    <div className="typing-text">
      {paragraph.split("").map((char, index) => {
        let className = "";

        if (index < typedText.length) {
          className = char === typedText[index] ? "correct" : "wrong";
        }

        if (index === typedText.length) {
          className = "current";
        }

        return (
          <span
            key={index}

            className={className}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}

export default TypingText;
