import { useBoardStore } from "../store/useBoardStore";

export default function Toolbar() {
  const setTool = useBoardStore((state) => state.setTool);
  const setStrokeWidth = useBoardStore((state) => state.setStrokeWidth);
  const setColor = useBoardStore((state) => state.setColor); // ✅ FIX

  function changeToold() {
    setTool("draw");
  }

  function changeToole() {
    setTool("erase");
  }

  function setStroke(w) {
    setStrokeWidth(w);
  }

  return (
    <div className="bar">
      <div >
        <button className="tab" onClick={changeToold}>Draw</button>
      </div>
      <div >
        <button className="tab" onClick={changeToole}>Erase</button>
      </div>
      <div>
        <input className="tab" type="color" onChange={(e) => setColor(e.target.value)} />
      </div>
      <div >
        <input
        className="tab"
          type="range"
          min="1"
          max="30"
          onChange={(e) => setStroke(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
