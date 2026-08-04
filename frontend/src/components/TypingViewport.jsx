import "../styles/typingViewport.css";

function TypingViewport({
    words,
    typed,
    currentIndex,
    currentChar
}) {

    // Show only a window of words around the current word
    const start = Math.max(0, currentIndex - 3);
    const end = start + 30;

    const visible = words.slice(start, end);

    return (

        <div className="typing-viewport">

            {

                visible.map((word, index) => {

                    const actualIndex = start + index;

                    const active = actualIndex === currentIndex;

                    return (

                        <span

                            key={actualIndex}

                            className={
                                active
                                    ? "current-word"
                                    : "word"
                            }

                        >

                            {

                                Array.from({

    length: Math.max(word.length, typed.length)

}).map((_,i)=>{

    const expectedChar = word[i];
    const typedChar = typed[i];

    let className = "";
    let displayChar = expectedChar;

    if(active){

        if(i < typed.length){

            if(i >= word.length){

                className = "wrong-char";
                displayChar = typedChar;

            }

            else if(typedChar === expectedChar){

                className = "correct-char";

            }

            else{

                className = "wrong-char";

            }

        }

        if(i === currentChar){

            className += " cursor";

        }

    }

    if(displayChar === undefined){

        displayChar = typedChar;

    }

    return(

        <span

            key={i}

            className={className.trim()}

        >

            {displayChar}

        </span>

    );

})

                            }

                            {" "}

                        </span>

                    );

                })

            }

        </div>

    );

}

export default TypingViewport;