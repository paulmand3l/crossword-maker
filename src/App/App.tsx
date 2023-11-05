import styles from "./App.module.styl";
import Grid from "../components/Square/Grid";
import { useState } from "react";

const isBlock = (l: string) => typeof l === 'undefined' || l === '-';

const App = () => {
  const size = 15;
  const [letters, setLetters] = useState<string[]>(new Array(size * size).fill(''));

  const handleChange = (i: number, letter: string) => {
    letter = letter.trim().toUpperCase();
    if (letter.length && !letter.match(/[A-Z]/)) return;
    letters.splice(i, 1, letter);
    console.log(letters);
    setLetters([...letters]);
  };

  let count = 1;
  const numbers = letters.map((letter, i) => {
    if (isBlock(letter)) return null;

    if (i < size || i % size === 0 || isBlock(letters[i-1]) || isBlock(letters[i-size])) {
      return count++;
    }
    return null;
  });

  return (
    <div className={styles.App}>
      <Grid letters={letters} numbers={numbers} onChange={handleChange} />
    </div>
  );
};

export default App;
