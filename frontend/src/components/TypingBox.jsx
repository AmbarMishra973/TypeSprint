import { useState, useEffect } from "react";
import Stats from "./Stats";
import Result from "./Result";


function TypingBox() {


    const paragraph =
    "The quick brown fox jumps over the lazy dog. Practice makes your typing faster and better.";


    const [typedText, setTypedText] = useState("");

    const [time, setTime] = useState(30);

    const [isRunning, setIsRunning] = useState(false);

    const [finished, setFinished] = useState(false);

    const correctCharacters = typedText
.split("")
.filter((char,index)=>char === paragraph[index])
.length;


const accuracy = typedText.length === 0 
? 100
: ((correctCharacters / typedText.length) * 100).toFixed(1);


const minutes = (30-time)/60;


const wpm = minutes === 0
? 0
: Math.round((correctCharacters/5)/minutes);



    useEffect(() => {


        let timer;


        if(isRunning && time > 0){

            timer = setInterval(() => {

                setTime(previous => previous - 1);

            },1000);

        }


        if(time === 0){

            setFinished(true);

            setIsRunning(false);

        }


        return () => clearInterval(timer);


    },[isRunning,time]);





    function handleTyping(event){


        if(finished){
            return;
        }


        if(!isRunning){

            setIsRunning(true);

        }


        setTypedText(event.target.value);


    }





    return (

        <div className="typing-box">


{
!finished && (

<>

    <div className="timer">
        Time Left: {time}s
    </div>


    <div className="paragraph">

        {
            paragraph.split("").map((char,index)=>{

                let color = "";

                if(index < typedText.length){

                    color = char === typedText[index]
                    ? "correct"
                    : "wrong";

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



    <Stats

        time={time}

        typedText={typedText}

        accuracy={accuracy}

        wpm={wpm}

    />

</>

)



}


{
finished && (

<Result

    wpm={wpm}

    accuracy={accuracy}

    characters={typedText.length}

    restart={()=>{

        setTypedText("");

        setTime(30);

        setFinished(false);

        setIsRunning(false);

    }}

/>

)

}


</div>

    );

}


export default TypingBox;