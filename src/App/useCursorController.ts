import { useEffect, useState } from "react";
import { mod } from "../utils";


export const useCursorController = (size: number) => {
  const [cursor, setCursor] = useState(Math.floor(size * size / 2));

  const moveCursorUp = () => setCursor(mod(cursor - size, size*size));
  const moveCursorDown = () => setCursor(mod(cursor + size, size*size));
  const moveCursorRight = () => {
    if (cursor % size === size - 1) {
      setCursor(cursor - size + 1);
    } else {
      setCursor(cursor + 1);
    }
  };
  const moveCursorLeft = () => {
    if (cursor % size === 0) {
      setCursor(cursor + size - 1);
    } else {
      setCursor(cursor - 1);
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        return moveCursorUp();
      case "ArrowDown":
        return moveCursorDown();
      case "ArrowRight":
        return moveCursorRight();
      case "ArrowLeft":
        return moveCursorLeft();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleClick = (i: number) => {
    setCursor(i);
  };

  return {
    cursor,
    handleClick,
  };
}
