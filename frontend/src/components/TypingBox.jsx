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

        repeatTest,

        newTest,

        bestRepeatedWpm,

        updateBest,

        calculateAccuracy,

        calculateWPM,

        calculateRawWPM,

        correctCharacters,

        incorrectCharacters,

        wpmHistory,

        addWpmPoint,

        ghostPosition,
setGhostPosition,
ghostWpm,
setGhostWpm


    } = useTypingEngine();




    const inputRef = useRef(null);

const ghostStartTime = useRef(null);





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

        updateBest();


    }



    return ()=>clearInterval(timer);



},[isRunning,time]);

useEffect(()=>{


    let animationFrame;



    function moveGhost(){


        if(!isRunning || ghostWpm <= 0){

            return;

        }



        if(!ghostStartTime.current){

            ghostStartTime.current =
            performance.now();

        }



        const elapsed =
        (
            performance.now()
            -
            ghostStartTime.current
        )
        /
        1000;



        const charactersPerSecond =
        (ghostWpm * 5) / 60;



        const position =
        Math.floor(
            elapsed * charactersPerSecond
        );



        setGhostPosition(position);



        animationFrame =
        requestAnimationFrame(moveGhost);


    }





    if(isRunning){

        animationFrame =
        requestAnimationFrame(moveGhost);

    }




    return ()=>{

        cancelAnimationFrame(animationFrame);

    }



},[
isRunning,
ghostWpm
]);







    function keyHandler(e){


        e.preventDefault();


        if(!isRunning){

    setGhostWpm(
    bestRepeatedWpm || calculateWPM()
);

    ghostStartTime.current=null;

}


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

ghostPosition={ghostPosition}
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

bestWpm={bestRepeatedWpm}

repeatTest={repeatTest}

newTest={newTest}

/>

}



</div>


);


}


export default TypingBox;