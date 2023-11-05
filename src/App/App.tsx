import styles from "./App.module.styl";
import Grid from "../components/Square/Grid";
import { useEffect, useRef, useState } from "react";
import { isBlock } from "../utils";
import { useControls } from "leva";


const App = () => {
  const { mirror, rotate } = useControls({ mirror: false, rotate: false })

  const size = 15;

  const inputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputsRef.current = Array.from(document.getElementsByClassName('square-input')) as HTMLInputElement[];
  }, []);

  const [letters, setLetters] = useState<string[]>(new Array(size * size).fill(''));
  const moveFocus = (indexModifier: number) => {
    const currentIndex = inputsRef.current.indexOf(document.activeElement as HTMLInputElement);
    const newIndex = currentIndex + indexModifier;
    inputsRef.current[newIndex]?.focus();
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      letters.splice(i, 1, '');
      setLetters([...letters]);
    }

    if (e.code === 'Minus') {
      const letter = letters[i] === '-' ? '' : '-';
      letters.splice(i, 1, letter);
      if (e.ctrlKey || rotate) {
        letters.splice(letters.length-i-1, 1, letter);
      }
      if (e.altKey || mirror) {
        letters.splice((Math.floor(i/size) + 1) * size - i % size - 1, 1, letter)
      }
      setLetters([...letters]);
    }

    if (e.code.match(/^(Key[A-Z]|Digit[0-9])$/i)) {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const letter = e.code.replace('Key', '').replace('Digit', '');
      letters.splice(i, 1, letter);
      setLetters([...letters]);
    }

    switch (e.key) {
      case 'ArrowUp': return moveFocus(-size);
      case 'ArrowDown': return moveFocus(size);
      case 'ArrowRight': return moveFocus(1);
      case 'ArrowLeft': return moveFocus(-1);
    }
  };

  const handleUnblock = (i: number) => {
    letters.splice(i, 1, '');
    setLetters([...letters]);
    setTimeout(() => {
      inputsRef.current[i]?.focus();
    });
  }

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
      <Grid letters={letters} numbers={numbers} onKeyDown={handleKeyDown} onUnblock={handleUnblock}/>
    </div>
  );
};

export default App;
