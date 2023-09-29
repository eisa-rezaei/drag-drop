import { MouseEvent, useCallback, useEffect, useState } from "react";
import "./App.css";

const colors = [
  "bg-blue-500",
  "bg-red-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-violet-500",
];

type TransForm = {
  x: number;
  y: number;
};

function App() {
  const [selectionList, setSelectionList] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState(colors[0]);

  const [prev, setPrev] = useState<TransForm>({
    x: 0,
    y: 0,
  });
  const [curr, setCurr] = useState<TransForm>({
    x: 0,
    y: 0,
  });

  const dragFunction = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const dragId = target.getAttribute("drag-id") || "";
    if (selectionList.includes(dragId)) {
      target.id = "";
      setSelectionList((prev) => prev.filter((i) => i !== dragId));
    } else {
      target.id = dragId;
      setSelectionList((prev) => [...prev, dragId]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const curr = colors.indexOf(currentColor);
      const next = (curr + 1) % colors.length;
      setCurrentColor(colors[next]);
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [currentColor]);

  const trackMouseHandler = useCallback(
    (e: globalThis.MouseEvent) => {
      setPrev({ ...curr });
      setCurr({ x: e.clientX, y: e.clientY });
      const deltaX = curr.x - prev.x;
      const deltaY = curr.y - prev.y;
      selectionList.forEach((i) => {
        const el = document.getElementById(i);
        if (el) {
          const { x, y } = getTransform(el);
          setTransform(el, {
            x: x + deltaX,
            y: y + deltaY,
          });
        }
      });
    },
    [selectionList, prev, curr]
  );

  useEffect(() => {
    window.addEventListener("mousemove", trackMouseHandler, false);
    return () => {
      window.removeEventListener("mousemove", trackMouseHandler, false);
    };
  }, [trackMouseHandler]);

  return (
    <div className="relative">
      <div className="flex gap-5">
        <div
          drag-id="element"
          onClick={dragFunction}
          className={`cursor-pointer text-left hover:border-white border-transparent border-2 p-10 transition-colors duration-200 ${currentColor}`}
        >
          contact
        </div>
        <div>
          <h1
            drag-id="heading"
            onClick={dragFunction}
            className="cursor-pointer text-left hover:border-white border-transparent border-2"
          >
            Eisa Rezaei
          </h1>
          <div
            className="cursor-pointer text-left hover:border-white border-transparent border-2"
            drag-id="edit-t"
            onClick={dragFunction}
          >
          <code>Frontend Developer</code>, writer and technologist 
          </div>
          <p
            drag-id="text"
            onClick={dragFunction}
            className="read-the-docs cursor-pointer hover:border-white border-transparent border-2"
          >
            Click on the Elements to drag and click again to drop
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

const getTransform = (el: HTMLElement) => {
  const style = window.getComputedStyle(el);
  const matrix = new WebKitCSSMatrix(style.transform);
  return { x: matrix.m41, y: matrix.m42 };
};

const setTransform = (el: HTMLElement, transform: TransForm) => {
  el.style.setProperty(
    "transform",
    `translate3d(${transform.x}px,${transform.y}px,0px)`,
    "important"
  );
};
