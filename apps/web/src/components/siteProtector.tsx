import { useEffect } from "react";

const SiteProtector = () => {
  useEffect(() => {
    // Disable right-click
    const disableContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);

    // Disable drag & drop (prevent saving images)
    const disableDrag = (e) => e.preventDefault();
    document.addEventListener("dragstart", disableDrag);

    // Detect developer tools
    let devtools = { open: false };
    const threshold = 160;
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;
      if (widthThreshold || heightThreshold) {
        if (!devtools.open) {
          devtools.open = true;
          window.location.reload(); // refresh if devtools detected
        }
      } else {
        devtools.open = false;
      }
    };
    const interval = setInterval(checkDevTools, 800);

    // Block suspicious shortcuts
    const blockedCombos = [
      // Copy/Paste/Save/Print/View Source
      { ctrl: true, key: ["c", "v", "x", "s", "u", "p", "a"] },
      // DevTools shortcuts
      { ctrl: true, shift: true, key: ["i", "j", "c", "k"] },
      // Cmd (Mac)
      { meta: true, key: ["c", "v", "x", "s", "u", "p", "a", "i", "j", "k"] },
    ];

    const blockShortcuts = (e) => {
      const key = e.key.toLowerCase();

      if (
        e.key === "F12" ||
        blockedCombos.some(
          (combo) =>
            (combo.ctrl ? !!e.ctrlKey : true) &&
            (combo.shift ? !!e.shiftKey : true) &&
            (combo.meta ? !!e.metaKey : true) &&
            combo.key.includes(key)
        )
      ) {
        e.preventDefault();
        e.stopPropagation();
        window.location.reload();
      }
    };
    document.addEventListener("keydown", blockShortcuts);

    // Prevent printing
    const handleBeforePrint = () => window.location.reload();
    window.addEventListener("beforeprint", handleBeforePrint);

    // Clean up
    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", blockShortcuts);
      document.removeEventListener("dragstart", disableDrag);
      window.removeEventListener("beforeprint", handleBeforePrint);
      clearInterval(interval);
    };
  }, []);

  return null;
};

export default SiteProtector;
