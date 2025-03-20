import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">AI-SRE</h1>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/rca" className="hover:text-blue-400">RCA</Link>
          <Link to="/docs" className="hover:text-blue-400">Docs</Link>
          <Link to="/coverage" className="hover:text-blue-400">Coverage</Link>
        </div>
        
        <button 
          className="md:hidden focus:outline-none" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      
      {menuOpen && (
        <div className="md:hidden flex flex-col mt-4 space-y-2 bg-gray-800 p-4 rounded-lg">
          <Link to="/rca" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>RCA</Link>
          <Link to="/docs" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>Docs</Link>
          <Link to="/coverage" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>Coverage</Link>
        </div>
      )}
    </nav>
  );
}
