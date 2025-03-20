import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RCA from "./pages/RCA"; // Create these components
import Docs from "./pages/Docs"; // Create these components
import Coverage from "./pages/Coverage"; // Create these components
import Navbar from "./components/Navbar"; // Import the Navbar component

function App() {
  return (
    <Router>
      <Navbar /> {/* Add the Navbar here */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rca" element={<RCA />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/coverage" element={<Coverage />} />
      </Routes>
    </Router>
  );
}

export default App;