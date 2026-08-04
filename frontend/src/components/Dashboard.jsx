function Dashboard({ stats, onReset }) {

    const practiceMinutes = Math.floor(
        stats.totalPracticeSeconds / 60
    );

    const practiceSeconds =
Math.floor(stats.totalPracticeSeconds % 60);

    return (

        <div className="dashboard">

            <h2>🏆 Personal Statistics</h2>

            <div className="dashboard-grid">

                <div>
                    <h3>Total Tests</h3>
                    <p>{stats.totalTests}</p>
                </div>

                <div>
                    <h3>Best WPM</h3>
                    <p>{stats.bestWpm}</p>
                </div>

                <div>
                    <h3>Average WPM</h3>
                    <p>{stats.averageWpm}</p>
                </div>

                <div>
                    <h3>Highest Accuracy</h3>
                    <p>{stats.highestAccuracy}%</p>
                </div>

                <div>
                    <h3>Total Words</h3>
                    <p>{stats.totalWords}</p>
                </div>

                <div>
                    <h3>Total Characters</h3>
                    <p>{stats.totalCharacters}</p>
                </div>

                <div>
                    <h3>Practice Time</h3>
                    <p>
                        {practiceMinutes}m {practiceSeconds}s
                    </p>
                </div>

            </div>

            <h3>Recent Tests</h3>

            {

                !stats.recentTests || stats.recentTests.length === 0

                ?

                <p>No tests completed yet.</p>

                :

                <ul className="recent-tests">

                    {

                        stats.recentTests.map((test,index)=>(

                            <li key={index}>

                                {test.wpm} WPM •{" "}
                                {test.accuracy}% •{" "}
                                {test.mode}

                            </li>

                        ))

                    }

                </ul>

            }

            <button

                className="restart-btn"

                onClick={onReset}

            >

                Reset Statistics

            </button>

        </div>

    );

}

export default Dashboard;