import { MouseEventHandler } from "react";
import clsx from "clsx";
import styles from "./Square.module.styl";
import { isBlank, isBlock } from "../../utils";

interface SquareProps {
  letter: string;
  number?: number | null;
  flags: Set<string>;
  active?: boolean;
  onClick?: MouseEventHandler;
}

const Square = (props: SquareProps) => {
  const { letter, number, flags, active = false, onClick } = props;

  return (
    <div
      className={clsx(
        styles.Square,
        isBlock(letter) && styles.block,
        active && styles.active,
        Array.from(flags).map(f => styles[f]),
      )}
      onClick={onClick}
    >
      {isBlock(letter) || isBlank(letter) ? null : (
        <div className={styles.letter}>{letter ?? ""}</div>
      )}
      {number ? <div className={styles.number}>{number}</div> : null}
    </div>
  );
};

export default Square;
