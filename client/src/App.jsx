import './App.css';
import './styles/app.scss'
import Toolbar from "./components/Toolbar";
import SettingBar from "./components/SettingBar";
import Canvas from "./components/Canvas";


function App() {
  return (
        <div className="app">
          <Toolbar/>
          <SettingBar/>
          <Canvas/>
        </div>
  );
}

export default App;
