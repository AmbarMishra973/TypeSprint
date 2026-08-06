import "../styles/home.css";
import Navbar from "../components/Navbar";
import TypingBox from "../components/TypingBox";

function Home() {
  return (
    <div className="home">
      <Navbar />

      <main>
        <h1>Improve your typing speed every day</h1>

        <TypingBox />
      </main>
    </div>
  );
}

export default Home;
