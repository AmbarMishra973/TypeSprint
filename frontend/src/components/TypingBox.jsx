import { useState } from "react";

function TypingBox() {

    const paragraph =
        "The quick brown fox jumps over the lazy dog. Practice makes your typing faster and better.";

    const [typedText, setTypedText] = useState("");


    function handleTyping(event) {

        setTypedText(event.target.value);

    }


    return (

        <div className="typing-box">


            <div className="paragraph">

                {
                    paragraph.split("").map((char, index) => {

                        let color = "";

                        if(index < typedText.length){

                            if(char === typedText[index]){
                                color = "correct";
                            }
                            else{
                                color = "wrong";
                            }

                        }


                        return (

                            <span 
                                key={index}
                                className={color}
                            >
                                {char}
                            </span>

                        );

                    })
                }

            </div>


            <textarea

                value={typedText}

                onChange={handleTyping}

                placeholder="Start typing here..."

            />


        </div>

    );

}

export default TypingBox;