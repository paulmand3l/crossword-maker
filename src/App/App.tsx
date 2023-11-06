import styles from "./App.module.styl";
import Grid from "../components/Square/Grid";
import { useLetterController } from "./useLetterController";
import { getWords } from "./wordController";

const App = () => {
  const size = 15;

  const { letters, cursor, handleClick } = useLetterController(size);
  const { numbers, across, down } = getWords(letters);

  console.log(across, down);

  return (
    <div className={styles.App}>
      <Grid
        letters={letters}
        numbers={numbers}
        cursor={cursor}
        onClick={handleClick}
      />
    </div>
  );
};

export default App;
