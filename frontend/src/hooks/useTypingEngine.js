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

    const result = [];

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

    const [words,setWords] = useState(generateWords());

    const [typed,setTyped] = useState("");

    const [currentIndex,setCurrentIndex] = useState(0);

    const [currentChar,setCurrentChar] = useState(0);

    const [time,setTime] = useState(30);

    const [selectedTime,setSelectedTime] = useState(30);

    const [isRunning,setIsRunning] = useState(false);

    const [finished,setFinished] = useState(false);

    const [correctWords,setCorrectWords] = useState(0);

    const [wrongWords,setWrongWords] = useState(0);

    const [totalCharacters,setTotalCharacters] = useState(0);



    function handleKey(key){

        if(finished) return;



        if(!isRunning){

            setIsRunning(true);

        }



        if(key==="Backspace"){

            if(typed.length===0) return;

            setTyped(previous=>previous.slice(0,-1));

            setCurrentChar(previous=>Math.max(previous-1,0));

            return;

        }



        if(key===" "){

            const expected = words[currentIndex];

            const entered = typed;



            if(entered===expected){

                setCorrectWords(previous=>previous+1);

                setTotalCharacters(previous=>previous+entered.length);

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

            setTyped(previous=>previous+key);

            setCurrentChar(previous=>previous+1);

        }

    }



    function calculateAccuracy(){

        const total = correctWords + wrongWords;

        if(total===0) return 0;

        return Number(((correctWords/total)*100).toFixed(1));

    }



    function calculateWPM(){

    const elapsedSeconds = selectedTime - time;

    if(elapsedSeconds <= 0){
        return 0;
    }

    const elapsedMinutes = elapsedSeconds / 60;

    return Math.round(correctWords / elapsedMinutes);

}



    function restart(){

        setWords(generateWords());

        setTyped("");

        setCurrentIndex(0);

        setCurrentChar(0);

        setCorrectWords(0);

        setWrongWords(0);

        setTotalCharacters(0);

        setTime(selectedTime);

        setFinished(false);

        setIsRunning(false);

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

        totalCharacters

    };

}

export default useTypingEngine;