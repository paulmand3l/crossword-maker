import React, {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from "react";
import clsx from "clsx";
import styles from "./Square.module.styl";

interface SquareProps {
  letter?: string;
  number?: number | null;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  onUnblock?: () => unknown;
}

const Square = (props: SquareProps) => {
  const { letter, number, onKeyDown, onUnblock } = props;

  const isBlock = letter === "-";

  const handleClick = () => {
    if (isBlock) {
      onUnblock?.();
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    onKeyDown?.(e);
  };

  return (
    <div
      className={clsx(styles.Square, isBlock && styles.block)}
      onClick={handleClick}
    >
      <input
        className="square-input"
        type="text"
        value={letter ?? ""}
        readOnly
        onKeyDown={handleKeyDown}
      />

      {number ? <div className={styles.number}>{number}</div> : null}
    </div>
  );
};

export default Square;
