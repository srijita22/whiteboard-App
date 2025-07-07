
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";

function App() {
  return (
    <>
    <div className="tool">
      <Toolbar/>
    </div>
    <div className="screen">
     <Canvas/>
    </div>
    </>
  );
}

export default App;
