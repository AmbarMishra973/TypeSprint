import "../styles/typingViewport.css";
import { useEffect, useRef, useState } from "react";


function TypingViewport({

    words,

    typed,

    currentIndex,

    currentChar,

    ghostPosition

}) {


    const WORDS_PER_LINE = 7;

    const VISIBLE_LINES = 3;


        const viewportRef = useRef(null);
    const [ghostStyle,setGhostStyle] = useState({});



    const currentLine =
    Math.floor(currentIndex / WORDS_PER_LINE);



    const startWord =
    currentLine * WORDS_PER_LINE;



    const visibleWords =
    words.slice(
        startWord,
        startWord + WORDS_PER_LINE * VISIBLE_LINES
    );



    // Convert character position into word + character

    let counter = 0;

    let ghostWordIndex = 0;

    let ghostCharIndex = 0;



    for(let i=0;i<words.length;i++){


        const wordLength =
        words[i].length + 1; // include space



        if(
            ghostPosition <
            counter + wordLength
        ){


            ghostWordIndex = i;


            ghostCharIndex =
            ghostPosition - counter;


            break;


        }


        counter += wordLength;


    }





    // Calculate floating ghost position

    useEffect(()=>{


    const element =
    document.querySelector(
        `[data-word="${ghostWordIndex}"][data-char="${ghostCharIndex}"]`
    );


    if(element && viewportRef.current){


        const rect =
        element.getBoundingClientRect();



        const parent =
        viewportRef.current.getBoundingClientRect();



        setGhostStyle({

            left:
            rect.left - parent.left,


            top:
            rect.top - parent.top

        });


    }


},[
ghostWordIndex,
ghostCharIndex,
ghostPosition
]);






    return (


       <div
    ref={viewportRef}
    className="typing-viewport"
>


            {
                Array.from({
                    length: VISIBLE_LINES
                }).map((_,lineIndex)=>{


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
                                                word
                                                .split("")
                                                .map(
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


                                                            data-word={wordIndex}


                                                            data-char={charIndex}


                                                            className={
                                                                className.trim()
                                                            }


                                                        >


                                                            {char}


                                                        </span>


                                                    );


                                                })
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





            {/* Floating Ghost Cursor */}


            <div


                className="floating-ghost"


                style={{


                    transform:
                    `translate(
                    ${ghostStyle.left || 0}px,
                    ${ghostStyle.top || 0}px
                    )`


                }}



            />




        </div>


    );


}


export default TypingViewport;