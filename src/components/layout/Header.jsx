import React from 'react';

const Header = ({ activeTab, setActiveTab }) => {
  const activeClass = "px-3.5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-sm transition-colors whitespace-nowrap";
  const inactiveClass = "px-3.5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-green-800 rounded-xl transition-all whitespace-nowrap";

  return (
    <header className="bg-green-100/90 backdrop-blur-xl border-b border-green-200 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="Cumulus Logo" 
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md hover:scale-105 transition-transform duration-200" 
          />
          <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
            Cumulus
          </span>
        </div>
        
        <nav className="flex overflow-x-auto w-full md:w-auto bg-white p-1 sm:p-1.5 rounded-2xl shadow-sm border border-slate-100 gap-1 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={activeTab === 'dashboard' ? activeClass : inactiveClass}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('tradelog')} 
            className={activeTab === 'tradelog' ? activeClass : inactiveClass}
          >
            Trade Log
          </button>
          <button 
            onClick={() => setActiveTab('currency')} 
            className={activeTab === 'currency' ? activeClass : inactiveClass}
          >
            Currency Log
          </button>
          <button 
            onClick={() => setActiveTab('screener')} 
            className={activeTab === 'screener' ? activeClass : inactiveClass}
          >
            Stock Screener
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
