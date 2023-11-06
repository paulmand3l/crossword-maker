import { useEffect, useState } from "react";
import { isBlock, mod } from "../utils";
import { useControls } from "leva";
import { Letters } from "./types";



export const useLetterController = (size: number) => {
  const { mirror, rotate } = useControls({ mirror: false, rotate: false });

  const [letters, setLetters] = useState<Letters>(
    new Array(size * size).fill("_")
  );
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
    if (e.key === "Backspace") {
      letters.splice(cursor, 1, "_");
      setLetters([...letters]);
    }

    if (e.code === "Minus" || e.code === 'Escape') {
      const letter = letters[cursor] === "-" ? "_" : "-";
      letters.splice(cursor, 1, letter);
      if (e.ctrlKey || rotate) {
        letters.splice(letters.length - cursor - 1, 1, letter);
      }
      if (e.altKey || mirror) {
        letters.splice(
          (Math.floor(cursor / size) + 1) * size - (cursor % size) - 1,
          1,
          letter
        );
      }
      setLetters([...letters]);
    }

    if (e.code.match(/^(Key[A-Z]|Digit[0-9])$/i)) {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const letter = e.code.replace("Key", "").replace("Digit", "");
      letters.splice(cursor, 1, letter);
      setLetters([...letters]);
    }

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
    if (isBlock(letters[i])) {
      letters.splice(i, 1, "");
      setLetters([...letters]);
    }

    setCursor(i);
  };

  return {
    letters,
    cursor,
    handleClick,
  };
}