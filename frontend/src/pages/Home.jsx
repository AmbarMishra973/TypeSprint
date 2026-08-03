import "../styles/home.css";
import Navbar from "../components/Navbar";
import TimeSelector from "../components/TimeSelector";
import TypingBox from "../components/TypingBox";
import Stats from "../components/Stats";

function Home() {

    return (

        <div className="home">

            <Navbar />

            <main>

                <h1>
                    Improve your typing speed every day
                </h1>

                <TimeSelector />

                <TypingBox />

                <Stats />

            </main>

        </div>

    );
}

export default Home;