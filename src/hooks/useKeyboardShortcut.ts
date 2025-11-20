import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  ctrlOrCmd: boolean = false
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifierPressed = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlOrCmd && !modifierPressed) return;
      if (!ctrlOrCmd && modifierPressed) return;

      if (event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [key, callback, ctrlOrCmd]);
}
