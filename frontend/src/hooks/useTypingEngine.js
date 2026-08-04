import { useState } from "react";


const wordBank = [
    "the","quick","brown","fox","jumps","over","lazy","dog",
    "typing","speed","accuracy","practice","keyboard",
    "developer","coding","javascript","react","spring",
    "boot","database","project","learning","future",
    "technology","computer","science","design","build",
    "experience","improve","daily","challenge"
];



function generateWords(amount = 300){

    const result=[];


    for(let i=0;i<amount;i++){

        result.push(
            wordBank[
                Math.floor(Math.random()*wordBank.length)
            ]
        );

    }


    return result;

}



function useTypingEngine(){


const [words,setWords]=useState(generateWords());


const [typed,setTyped]=useState("");


const [currentIndex,setCurrentIndex]=useState(0);


const [currentChar,setCurrentChar]=useState(0);


const [time,setTime]=useState(30);


const [selectedTime,setSelectedTime]=useState(30);


const [isRunning,setIsRunning]=useState(false);


const [finished,setFinished]=useState(false);



const [correctWords,setCorrectWords]=useState(0);

const [wrongWords,setWrongWords]=useState(0);

const [wpmHistory,setWpmHistory] = useState([]);



const [correctCharacters,setCorrectCharacters]=useState(0);

const [incorrectCharacters,setIncorrectCharacters]=useState(0);




function handleKey(key){


if(finished) return;



if(!isRunning){

    setIsRunning(true);

}



if(key==="Backspace"){


    if(typed.length===0)
        return;


    setTyped(previous=>previous.slice(0,-1));

    setCurrentChar(previous=>Math.max(previous-1,0));


    return;

}




if(key===" "){


    const expected = words[currentIndex];


    const entered = typed;



    if(entered===expected){

        setCorrectWords(previous=>previous+1);

    }

    else{

        setWrongWords(previous=>previous+1);

    }



    setTyped("");

    setCurrentChar(0);


    setCurrentIndex(previous=>previous+1);


    return;

}




if(key.length===1){


    const expected =
    words[currentIndex][currentChar];



    if(key===expected){

        setCorrectCharacters(previous=>previous+1);

    }

    else{

        setIncorrectCharacters(previous=>previous+1);

    }



    setTyped(previous=>previous+key);

    setCurrentChar(previous=>previous+1);


}



}







function calculateAccuracy(){


const total =
correctCharacters + incorrectCharacters;



if(total===0)
    return 0;



return Number(
(
(correctCharacters/total)*100
).toFixed(1)
);


}






function calculateWPM(){


const elapsedSeconds =
selectedTime-time;



if(elapsedSeconds<=0)
return 0;



const minutes =
elapsedSeconds/60;



return Math.round(
correctCharacters/5/minutes
);


}






function calculateRawWPM(){


const elapsedSeconds =
selectedTime-time;



if(elapsedSeconds<=0)
return 0;



const minutes =
elapsedSeconds/60;



return Math.round(
(correctCharacters+incorrectCharacters)
/5
/minutes
);


}

function addWpmPoint(){


    const elapsedSeconds =
    selectedTime - time;


    if(elapsedSeconds <=0)
        return;



    const minutes =
    elapsedSeconds / 60;



    const currentWpm =
    Math.round(
        correctCharacters / 5 / minutes
    );


    setWpmHistory(previous=>[

        ...previous,

        {
            time:elapsedSeconds,
            wpm:currentWpm
        }

    ]);


}





function restart(){


setWords(generateWords());

setTyped("");

setCurrentIndex(0);

setCurrentChar(0);


setCorrectWords(0);

setWrongWords(0);


setCorrectCharacters(0);

setIncorrectCharacters(0);


setTime(selectedTime);

setFinished(false);

setIsRunning(false);

setWpmHistory([]);


}






return{


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

};



}



export default useTypingEngine;