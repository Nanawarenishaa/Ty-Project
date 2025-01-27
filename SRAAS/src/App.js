import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Components/Dashboard";



function App() {
  return (
    <div className="App">
    
       <Header />
       <Sidebar />
       <Routes>
       <Route path="/" element={<Dashboard />} />

       </Routes>
    </div>
  );
}

export default App;
