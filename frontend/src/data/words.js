const words = [
  "typing", "keyboard", "computer", "developer", "software", "engineer", "react", "spring",
  "boot", "java", "database", "project", "practice", "accuracy", "speed", "future",
  "learning", "coding", "design", "algorithm", "challenge", "internet", "website", "performance",
  "frontend", "backend", "network", "system", "function", "variable", "object", "component",
  "application", "technology", "creative", "professional", "success", "focus", "discipline", "consistency",
  "knowledge", "experience", "innovation", "quality", "beautiful", "efficient", "modern", "powerful",
  "simple", "random", "dynamic", "interface", "framework", "repository", "github", "testing",
  "production", "excellent", "solution", "problem", "improvement", "education", "career", "student",
  "screen", "window", "browser", "monitor", "mouse", "display", "terminal", "editor",
  "visual", "studio", "javascript", "typescript", "python", "compiler", "server", "about",
  "above", "add", "after", "again", "air", "all", "almost", "along",
  "also", "always", "america", "animal", "another", "answer", "any", "are",
  "around", "ask", "away", "back", "because", "been", "before", "began",
  "best", "better", "between", "big", "book", "both", "boy", "call",
  "came", "can", "car", "carry", "change", "children", "city", "close",
  "come", "could", "country", "day", "did", "different", "does", "don't",
  "down", "each", "earth", "eat", "end", "enough", "even", "every",
  "example", "eye", "face", "family", "far", "father", "feet", "few",
  "find", "first", "follow", "food", "form", "found", "four", "from",
  "get", "girl", "give", "good", "got", "great", "group", "grow",
  "had", "half", "hand", "hard", "has", "have", "head", "hear",
  "help", "her", "here", "high", "him", "his", "home", "house",
  "how", "idea", "important", "indian", "into", "its", "just", "keep",
  "kind", "know", "land", "large", "last", "late", "leave", "left",
  "let", "letter", "life", "light", "like", "line", "list", "little",
  "live", "long", "look", "made", "make", "man", "many", "may",
  "mean", "men", "might", "mile", "miss", "more", "most", "mother",
  "mountain", "much", "must", "name", "near", "need", "never", "new",
  "next", "night", "not", "now", "number", "often", "old", "once",
  "one", "only", "open", "other", "our", "out", "over", "own",
  "page", "paper", "part", "people", "picture", "place", "plant", "play",
  "point", "put", "read", "real", "right", "river", "run", "said",
  "same", "saw", "say", "school", "sea", "second", "see", "seem",
  "sentence", "set", "she", "should", "show", "side", "small", "some",
  "something", "sometimes", "song", "soon", "sound", "spell", "start", "state",
  "still", "story", "study", "such", "take", "talk", "tell", "than",
  "that", "the", "their", "them", "then", "there", "these", "they",
  "thing", "think", "this", "those", "thought", "three", "through", "time",
  "together", "too", "took", "tree", "try", "turn", "two", "under",
  "until", "upon", "use", "very", "walk", "want", "was", "watch",
  "water", "way", "we", "went", "were", "what", "when", "where",
  "which", "while", "white", "who", "why", "will", "with", "without",
  "word", "work", "world", "would", "write", "year", "you", "young",
  "your", "ability", "accept", "according", "account", "across", "action", "activity", "actually",
  "address", "administration", "admit", "adult", "affect", "afternoon", "again", "against", "agency",
  "agent", "agreement", "ahead", "allow", "almost", "alone", "along", "already", "although",
  "always", "american", "among", "amount", "analysis", "ancient", "another", "answer", "anyone",
  "anything", "appear", "apply", "approach", "appropriate", "area", "argue", "around", "arrive",
  "article", "artist", "assume", "attack", "attention", "attorney", "audience", "author", "authority",
  "available", "avoid", "beautiful", "become", "before", "behind", "believe", "benefit", "beyond",
  "building", "business", "camera", "campaign", "candidate", "capital", "card", "careful", "center",
  "central", "century", "certain", "chair", "challenge", "chance", "change", "character", "charge",
  "choice", "choose", "church", "citizen", "claim", "classic", "clearly", "client", "climate"
];

export const quotes = [
  { content: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { content: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { content: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { content: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { content: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { content: "Knowledge is power.", author: "Francis Bacon" },
  { content: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { content: "In order to be irreplaceable one must always be different.", author: "Coco Chanel" },
  { content: "Make it work, make it right, make it fast.", author: "Kent Beck" }
];

export const codeSnippets = [
  "const sum = (a, b) => a + b;",
  "function fetchData(url) { return fetch(url).then(res => res.json()); }",
  "for (let i = 0; i < array.length; i++) { console.log(array[i]); }",
  "public static void main(String[] args) { System.out.println(\"Hello World\"); }",
  "def calculate_area(radius): return 3.14159 * radius ** 2",
  "const [state, setState] = useState(initialState);",
  "import React, { useEffect, useState } from 'react';",
  "document.addEventListener('DOMContentLoaded', () => { initApp(); });",
  "export default function App() { return <div className=\"app\">TypeSprint</div>; }",
  "if (user && user.isLoggedIn) { redirect('/dashboard'); }"
];

export function generateWeakKeyWords(missedKeys = {}, count = 30) {
  const keys = Object.keys(missedKeys);
  if (keys.length === 0) return words.slice(0, count);

  // Sort keys by frequency
  const sortedKeys = keys.sort((a, b) => missedKeys[b] - missedKeys[a]).map(k => k.toLowerCase());
  const matchingWords = words.filter(w => sortedKeys.some(k => w.toLowerCase().includes(k)));

  if (matchingWords.length === 0) return words.slice(0, count);

  const result = [];
  for (let i = 0; i < count; i++) {
    const word = matchingWords[Math.floor(Math.random() * matchingWords.length)];
    result.push(word);
  }
  return result;
}

export default words;

