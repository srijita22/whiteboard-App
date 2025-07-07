import { useEffect, useRef, useState } from "react";
import { useBoardStore } from "../store/useBoardStore";

export default function Canvas() {
  const tool = useBoardStore((state) => state.tool);
  const strokeWidth = useBoardStore((state) => state.strokeWidth);
  const color = useBoardStore((state) => state.color);

  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [cntxt, setCntxt] = useState(null);

  const [history, setHistory] = useState([]);
  const [redo, setRedo] = useState([]);
  const currentPath = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    setCntxt(context);
  }, []);

  function startDraw(e) {
    if (!cntxt) return;
    drawing.current = true;
    cntxt.beginPath();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    cntxt.moveTo(x, y);
    cntxt.strokeStyle = tool === "erase" ? "#ffffff" : color;
    cntxt.lineWidth = strokeWidth;
    cntxt.stroke();

    currentPath.current = [{ x, y, tool, color, strokeWidth }];
  }

  function draw(e) {
    if (!cntxt || !drawing.current) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    cntxt.strokeStyle = tool === "erase" ? "#ffffff" : color;
    cntxt.lineWidth = strokeWidth;
    cntxt.lineTo(x, y);
    cntxt.stroke();

    currentPath.current.push({ x, y, tool, color, strokeWidth });
  }

  function stopDraw() {
  if (!cntxt) return;
  drawing.current = false;
  cntxt.closePath();
  if (currentPath.current.length > 0) {
    const finishedPath = [...currentPath.current];
    setHistory((prev) => [...prev, finishedPath]);
    setRedoStack([]);
    currentPath.current = [];
  }
}


  function redrawFromHistory(paths) {
    const canvas = canvasRef.current;
    const cntxt = canvas.getContext("2d");
    cntxt.clearRect(0, 0, canvas.width, canvas.height);

   for (let path of paths) {
  if (path.length === 0) continue;

  const { tool, color, strokeWidth } = path[0];
  cntxt.strokeStyle = tool === "erase" ? "#ffffff" : color;
  cntxt.lineWidth = strokeWidth;

  cntxt.beginPath();
  cntxt.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    const point = path[i];
    cntxt.lineTo(point.x, point.y);
  }
  cntxt.stroke();
  cntxt.closePath();
}

  }

  function handleUndo() {
    if (history.length === 0) return;
    const updatedHistory = history.slice(0, -1);
    const last = history[history.length - 1];
    setHistory(updatedHistory);
    setRedo((prev) => [...prev, last]);
    redrawFromHistory(updatedHistory);
  }

  function handleRedo() {
    if (redo.length === 0) return;
    const last = redo[redo.length - 1];
    const updatedRedo = redo.slice(0, -1);
    const updatedHistory = [...history, last];
    setRedo(updatedRedo);
    setHistory(updatedHistory);
    redrawFromHistory(updatedHistory);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setRedo([]);
  }

  function downloadCanvas() {
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        width={800}
        height={500}
        className="board"
      />
    <div className="toolbar-container">
      <div className="toolbar">
        <button className="tab" onClick={handleUndo}>Undo</button>
        <button className="tab" onClick={handleRedo}>Redo</button>
        <button className="tab" onClick={clearCanvas}>Clear All</button>
        <button className="tab" onClick={downloadCanvas}>Download</button>
      </div>
      </div>
    </div>
  );
}



