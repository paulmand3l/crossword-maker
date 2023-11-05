import React from "react";
import clsx from "clsx";
import styles from "./Square.module.styl";

interface SquareProps {
  letter?: string;
  number?: number | null;
  onChange?: (newValue: string) => unknown;
}

const Square = (props: SquareProps) => {
  const { letter, number, onChange, ...rest } = props;

  const isBlock = letter === "-";

  const handleClick = () => {
    if (isBlock) {
      onChange?.("");
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    onChange?.(newValue);
  };

  return (
    <div
      className={clsx(styles.Square, isBlock && styles.block)}
      onClick={handleClick}
      {...rest}
    >
      {isBlock ? null : (
        <input
          type="text"
          value={letter ?? ""}
          minLength={0}
          maxLength={1}
          onChange={handleChange}
        />
      )}
      {number ? <div className={styles.number}>{number}</div> : null}
    </div>
  );
};

export default Square;
