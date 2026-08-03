function Stats({time, typedText, accuracy, wpm}) {

    return (

        <div className="stats">


            <div>
                <h3>Time</h3>
                <p>{time}s</p>
            </div>


            <div>
                <h3>WPM</h3>
                <p>{wpm}</p>
            </div>


            <div>
                <h3>Accuracy</h3>
                <p>{accuracy}%</p>
            </div>


            <div>
                <h3>Characters</h3>
                <p>{typedText.length}</p>
            </div>


        </div>

    );

}


export default Stats;