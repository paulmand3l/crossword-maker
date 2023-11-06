import { MouseEventHandler } from "react";
import clsx from "clsx";
import styles from "./Square.module.styl";
import { isBlock } from "../../utils";

interface SquareProps {
  letter?: string;
  number?: number | null;
  active?: boolean;
  onClick?: MouseEventHandler;
}

const Square = (props: SquareProps) => {
  const { letter, number, active, onClick } = props;

  return (
    <div
      className={clsx(styles.Square, isBlock(letter) && styles.block, active && styles.active)}
      onClick={onClick}
    >
      {isBlock(letter) ? null : <div className={styles.letter}>{letter ?? ""}</div>}
      {number ? <div className={styles.number}>{number}</div> : null}
    </div>
  );
};

export default Square;
