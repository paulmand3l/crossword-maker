import styles from "./App.module.styl";
import Grid from "../components/Square/Grid";
import { useLetterController } from "./useLetterController";
import { getWordNumbers, getWords } from "./wordController";
import { useCursorController } from "./useCursorController";
import { Annotations } from "./types";
import { useEffect, useState } from "react";
import { solve } from "./solver";
import { isInteger } from "lodash";

const getSize = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const size = parseInt(urlParams.get('size') ?? '15');
  return isInteger(size) ? size : 15;
}

const App = () => {
  const size = getSize();

  const { cursor, handleClick } = useCursorController(size);
  const letters = useLetterController(size, cursor);

  const [annotations, setAnnotations] = useState<Annotations>();

  useEffect(() => {
    const numbers = getWordNumbers(letters);
    const { across, down, flags } = getWords(letters, numbers);
    setAnnotations({ flags, numbers });
    solve(size, across, down);
  }, [size, letters]);

  if (!annotations) return null;

  return (
    <div className={styles.App}>
      <Grid
        letters={letters}
        numbers={annotations.numbers}
        flags={annotations.flags}
        cursor={cursor}
        onClick={handleClick}
      />
    </div>
  );
};

export default App;
