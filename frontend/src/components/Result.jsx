function Result({

    wpm,

    rawWpm,

    accuracy,

    characters,

    errors,

    history,

    restart

}) {


    const maxWpm = Math.max(
        ...history.map(point => point.wpm),
        10
    );



    const width = 450;

    const height = 180;



    const points = history.map((point,index)=>{


        const x =
        (index /
        Math.max(history.length-1,1))
        *
        width;



        const y =
        height -
        (
            point.wpm /
            maxWpm
        )
        *
        height;



        return `${x},${y}`;


    }).join(" ");




    return (

        <div className="result-card">


            <h2>
                Test Complete 🎉
            </h2>




            <div className="result-stats">



                <div>

                    <h3>WPM</h3>

                    <p>{wpm}</p>

                </div>




                <div>

                    <h3>Raw WPM</h3>

                    <p>{rawWpm}</p>

                </div>




                <div>

                    <h3>Accuracy</h3>

                    <p>{accuracy}%</p>

                </div>




                <div>

                    <h3>Characters</h3>

                    <p>{characters}</p>

                </div>




                <div>

                    <h3>Errors</h3>

                    <p>{errors}</p>

                </div>



            </div>







            <div className="graph-container">


                <h3>
                    WPM Progress
                </h3>



                <div className="axis-wrapper">


                    <div className="y-axis">

                        WPM

                    </div>




                    <svg

                    width={width}

                    height={height}

                    className="wpm-graph"


                    >



                    {/* Y axis */}

                    <line

                    x1="0"

                    y1="0"

                    x2="0"

                    y2={height}

                    stroke="white"

                    />



                    {/* X axis */}

                    <line

                    x1="0"

                    y1={height}

                    x2={width}

                    y2={height}

                    stroke="white"

                    />





                    <polyline

                    points={points}

                    fill="none"

                    stroke="#39d353"

                    strokeWidth="3"

                    />

                    {
history.map((point,index)=>{


const x =
(index /
Math.max(history.length-1,1))
*
width;



const y =
height -
(
point.wpm /
maxWpm
)
*
height;



return (

<circle

key={index}

cx={x}

cy={y}

r="5"

fill="#39d353"

>

<title>

{point.wpm} WPM at {point.time}s

</title>

</circle>

);


})
}



                    </svg>



                </div>




                <div className="x-axis">

                    Time (seconds)

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