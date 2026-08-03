function Result({wpm, accuracy, characters, restart}) {

    return (

        <div className="result-card">

            <h2>Test Complete 🎉</h2>


            <div className="result-stats">

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
                    <p>{characters}</p>
                </div>

            </div>


            <button 
                onClick={restart}
                className="restart-btn"
            >
                Try Again
            </button>


        </div>

    );

}


export default Result;