import { useEffect, useRef } from "react";
import useTypingEngine from "../hooks/useTypingEngine";
import TypingViewport from "./TypingViewport";
import Stats from "./Stats";
import Result from "./Result";
import "../styles/typingBox.css";


function TypingBox() {


    const {

        words,

        typed,

        currentIndex,

        currentChar,

        handleKey,

        time,

        setTime,

        selectedTime,

        setSelectedTime,

        isRunning,

        setIsRunning,

        finished,

        setFinished,

        restart,

        calculateAccuracy,

        calculateWPM,

        calculateRawWPM,

correctCharacters,

incorrectCharacters,

wpmHistory,

addWpmPoint


    } = useTypingEngine();




    const inputRef = useRef(null);




    useEffect(() => {


        let timer;


        if(isRunning && time>0){


            timer=setInterval(()=>{

    setTime(t=>t-1);

    addWpmPoint();

},1000);


        }



        if(time===0){


            setFinished(true);

            setIsRunning(false);


        }



        return ()=>clearInterval(timer);



    },[isRunning,time]);







    function keyHandler(e){


        e.preventDefault();


        handleKey(e.key);


    }







return (

<div className="typing-box">



<div className="time-selector">


{
[30,60,120].map(seconds=>(


<button

key={seconds}

className={
selectedTime===seconds
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

Time Left : {time}s

</div>







{

!finished &&


<>


<TypingViewport


words={words}

typed={typed}

currentIndex={currentIndex}

currentChar={currentChar}


/>






<Stats


time={time}


wpm={calculateWPM()}


rawWpm={calculateRawWPM()}


accuracy={calculateAccuracy()}


characters={correctCharacters}


errors={incorrectCharacters}


/>






<input


ref={inputRef}


autoFocus


className="hidden-input"


onKeyDown={keyHandler}


onBlur={()=>
inputRef.current.focus()
}


/>


</>


}







{

finished &&


<Result

wpm={calculateWPM()}

rawWpm={calculateRawWPM()}

accuracy={calculateAccuracy()}

characters={correctCharacters}

errors={incorrectCharacters}

history={wpmHistory}

restart={restart}

/>

}



</div>


);


}


export default TypingBox;