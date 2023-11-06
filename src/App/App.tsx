import styles from "./App.module.styl";
import Grid from "../components/Square/Grid";
import { useLetterController } from "./useLetterController";

const App = () => {
  const size = 15;

  const controller = useLetterController(size);

  return (
    <div className={styles.App}>
      <Grid
        letters={controller.letters}
        numbers={controller.numbers}
        cursor={controller.cursor}
        onClick={controller.handleClick}
      />
    </div>
  );
};

export default App;
