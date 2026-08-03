import { useState, useEffect } from "react";
import TypingText from "./TypingText";
import Stats from "./Stats";
import Result from "./Result";


function TypingBox() {


    const paragraph =
    "The quick brown fox jumps over the lazy dog. Practice makes your typing faster and better.";


    const [typedText, setTypedText] = useState("");

    const [selectedTime, setSelectedTime] = useState(30);

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


<div className="time-selector">

{
[30,60,120].map((seconds)=>(


<button

key={seconds}

className={
selectedTime === seconds
?
"active-time"
:
""
}


onClick={()=>{

setSelectedTime(seconds);

setTime(seconds);

}}


>

{seconds}s

</button>


))

}

</div>



<div className="timer">

Time Left: {time}s

</div>


    <TypingText

paragraph={paragraph}

typedText={typedText}

/>



   <textarea

className="hidden-input"

value={typedText}

onChange={handleTyping}

autoFocus

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

        setTime(selectedTime);

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