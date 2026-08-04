import "../styles/typingViewport.css";


function TypingViewport({

    words,

    typed,

    currentIndex,

    currentChar

}) {


    const WORDS_PER_LINE = 7;

    const VISIBLE_LINES = 3;



    const currentLine =
    Math.floor(currentIndex / WORDS_PER_LINE);



    const startWord =
    currentLine * WORDS_PER_LINE;



    const visibleWords =
    words.slice(
        startWord,
        startWord + WORDS_PER_LINE * VISIBLE_LINES
    );



    return (

        <div className="typing-viewport">


            {
                Array.from({
                    length: VISIBLE_LINES
                }).map((_, lineIndex)=>{


                    const lineWords =
                    visibleWords.slice(
                        lineIndex * WORDS_PER_LINE,
                        (lineIndex + 1) * WORDS_PER_LINE
                    );


                    return (

                        <div

                            className="typing-line"

                            key={lineIndex}

                        >


                            {
                                lineWords.map((word,index)=>{


                                    const wordIndex =
                                    startWord +
                                    lineIndex * WORDS_PER_LINE +
                                    index;



                                    const isActive =
                                    wordIndex === currentIndex;



                                    return (

                                        <span

                                            className={
                                                isActive
                                                ?
                                                "typing-word active-word"
                                                :
                                                "typing-word"
                                            }

                                            key={wordIndex}

                                        >


                                            {
                                                word.split("").map(
                                                    (char,charIndex)=>{


                                                        let className="";


                                                        if(isActive){


                                                            if(
                                                                charIndex < typed.length
                                                            ){


                                                                className =
                                                                typed[charIndex] === char
                                                                ?
                                                                "correct-char"
                                                                :
                                                                "wrong-char";


                                                            }


                                                            if(
                                                                charIndex === currentChar
                                                            ){

                                                                className += " cursor";

                                                            }


                                                        }



                                                        return (

                                                            <span

                                                                key={charIndex}

                                                                className={
                                                                    className.trim()
                                                                }

                                                            >

                                                                {char}

                                                            </span>

                                                        );


                                                    }
                                                )

                                            }



                                            {


                                            isActive &&
                                            typed.length > word.length &&

                                            typed
                                            .slice(word.length)
                                            .split("")
                                            .map((char,index)=>(


                                                <span

                                                    key={
                                                        "extra-"+index
                                                    }

                                                    className="wrong-char"

                                                >

                                                    {char}

                                                </span>


                                            ))


                                            }


                                        </span>

                                    );


                                })
                            }


                        </div>

                    );


                })
            }


        </div>

    );


}


export default TypingViewport;