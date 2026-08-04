import { useEffect, useRef } from "react";
import useTypingEngine from "../hooks/useTypingEngine";
import TypingViewport from "./TypingViewport";
import Stats from "./Stats";
import Result from "./Result";
import ModeSelector from "./ModeSelector";
import Dashboard from "./Dashboard";
import "../styles/typingBox.css";


function TypingBox(){


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


    testMode,

    changeTestMode,


    wordLimit,

    changeWordLimit,


    isRunning,

    setIsRunning,


    finished,


    repeatTest,

    newTest,


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

    setGhostWpm,


    getElapsedSeconds,


    stats,

    clearStatistics,


    finishTest


}=useTypingEngine();





const inputRef = useRef(null);

const ghostStartTime = useRef(null);






// TIMER

useEffect(()=>{


let timer;



if(
    isRunning &&
    testMode==="time"
){


timer=setInterval(()=>{


    setTime(prev=>{


        if(prev<=1){


            addWpmPoint();

            finishTest();


            return 0;

        }



        return prev-1;


    });



    if(time>1){

        addWpmPoint();

    }



},1000);



}



return ()=>{

    clearInterval(timer);

};


},[
    isRunning,
    time,
    testMode
]);









// GHOST

useEffect(()=>{


let frame;



function animate(){


if(
    !isRunning ||
    ghostWpm<=0
)
return;



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



const speed =
(ghostWpm*5)/60;



setGhostPosition(

Math.floor(
elapsed*speed
)

);



frame=requestAnimationFrame(
animate
);



}



if(isRunning){

frame=requestAnimationFrame(
animate
);

}



return ()=>{

cancelAnimationFrame(frame);

};



},[
isRunning,
ghostWpm
]);


// WPM GRAPH TRACKER (BOTH MODES)

useEffect(()=>{

let graphTimer;


if(isRunning){

    graphTimer=setInterval(()=>{

        addWpmPoint();

    },1000);

}


return ()=>{

    clearInterval(graphTimer);

};


},[
isRunning
]);






function keyHandler(e){


e.preventDefault();



if(!isRunning){


ghostStartTime.current=null;



setGhostWpm(
    stats.bestWpm || 0
);



}



handleKey(e.key);



}







const elapsedTime = Math.floor(
    getElapsedSeconds()
);







return (

<div className="typing-box">







<ModeSelector


testMode={testMode}


setTestMode={changeTestMode}



selectedTime={selectedTime}


setSelectedTime={(value)=>{


setSelectedTime(value);


setTime(value);


}}



wordLimit={wordLimit}


setWordLimit={changeWordLimit}


/>









<div className="timer">


{

testMode==="time"


?


<>

Time Left : {time}s

</>


:


<>

Time Taken : {elapsedTime}s

</>


}


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



onBlur={()=>{


inputRef.current?.focus();


}}


/>







</>


}









{

finished &&


<>



<Result


wpm={calculateWPM()}


rawWpm={calculateRawWPM()}


accuracy={calculateAccuracy()}


characters={correctCharacters}


errors={incorrectCharacters}



history={wpmHistory}


bestWpm={stats.bestWpm}


testHistory={stats.recentTests}



elapsedTime={elapsedTime}



repeatTest={repeatTest}


newTest={newTest}


/>









<Dashboard


stats={stats}


onReset={clearStatistics}


/>



</>


}







</div>


);


}



export default TypingBox;