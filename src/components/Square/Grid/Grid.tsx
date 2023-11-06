import styles from "./Grid.module.styl";
import Square from "..";
import { Flags, Letters, Numbers } from "../../../App/types";

const isSquare = (n: number) => n > 0 && Math.sqrt(n) % 1 === 0;

interface GridProps {
  letters: Letters;
  numbers: Numbers;
  flags: Flags;
  cursor: number;
  onClick?: (i: number) => unknown;
}

const Grid = (props: GridProps) => {
  const { letters, numbers, flags, cursor, onClick } = props;

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
                active={cursor === index}
                letter={letter}
                number={numbers[index]}
                flags={flags[index]}
                onClick={() => onClick?.(index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
