import styles from "./Grid.module.styl";
import Square from "..";

const isSquare = (n: number) => n > 0 && Math.sqrt(n) % 1 === 0;

type Letters = string[];
type Numbers = (number | null)[];

interface GridProps {
  letters: Letters;
  numbers: Numbers;
  onKeyDown?: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => unknown;
  onUnblock?: (i: number) => unknown;
}

const Grid = (props: GridProps) => {
  const { letters, numbers, onKeyDown, onUnblock } = props;

  if (!isSquare(letters.length)) {
    throw new Error("Letters length must be a perfect square");
  }

  const size = Math.sqrt(letters.length);

  const rows = letters.reduce<string[][]>((rows, letter, index) => {
    const rowIndex = Math.floor(index / size);

    if (!rows[rowIndex]) {
      rows[rowIndex] = [] as string[]; // start a new chunk
    }

    rows[rowIndex].push(letter);

    return rows;
  }, [] as string[][]);

  return (
    <div className={styles.Grid}>
      {rows.map((row, i) => (
        <div key={i} className={styles.row}>
          {row.map((letter, j) => {
            const index = i * size + j;
            return (
              <Square
                key={index}
                letter={letter}
                number={numbers[index]}
                onKeyDown={(e) => onKeyDown?.(index, e)}
                onUnblock={() => onUnblock?.(index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
