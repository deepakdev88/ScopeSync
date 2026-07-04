import { NavLink } from 'react-router'; 

export default function Footer() {
  return (
    <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-white/5 text-gray-500 text-xs relative z-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center text-center sm:text-left">
        
        {/* Copyright Text */}
        <div>
          © 2026 ScopeSync. Built by Deepak Singh.
        </div>
        
        {/* Links Area */}
        <div className="flex justify-center gap-6">
          <a 
            href="https://github.com/deepakdev88" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-emerald-400 transition-colors duration-200"
          >
            GitHub
          </a>
          <a 
            href="mailto:deepaksingh.dev88@gmail.com" 
            className="hover:text-emerald-400 transition-colors duration-200"
          >
            Contact
          </a>
          
          
          {/* <NavLink 
            to="/privacy" 
            className={({ isActive }) => isActive ? "text-emerald-400" : "hover:text-emerald-400 transition-colors"}
          >
            Privacy
          </NavLink> 
          */}
        </div>

      </div>
    </footer>
  );
}