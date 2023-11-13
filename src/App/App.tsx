import styles from "./App.module.styl";
import Grid from "../components/Square/Grid";
import { useLetterController } from "./useLetterController";
import { getWordNumbers, getWords } from "./wordController";
import { useCursorController } from "./useCursorController";
import { Words } from "./types";
import { useEffect, useState } from "react";

const App = () => {
  const size = 15;

  const { cursor, handleClick } = useCursorController(size);
  const letters = useLetterController(size, cursor);

  const [words, setWords] = useState<Words>();

  useEffect(() => {
    const numbers = getWordNumbers(letters);
    const { across, down, flags } = getWords(letters, numbers);
    console.log(across, down);
    setWords({ across, down, flags, numbers });
  }, [letters]);

  if (!words) return null;

  return (
    <div className={styles.App}>
      <Grid
        letters={letters}
        numbers={words?.numbers}
        flags={words?.flags}
        cursor={cursor}
        onClick={handleClick}
      />
    </div>
  );
};

export default App;
