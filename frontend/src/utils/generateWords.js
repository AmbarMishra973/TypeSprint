import words from "../data/words";

function generateWords(count = 250) {
  let result = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);

    result.push(words[randomIndex]);
  }

  return result.join(" ");
}

export default generateWords;