
import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Download, Trash2, FileText, ClipboardList, Settings, ChevronLeft, LogOut, Sun, Moon, FileSpreadsheet } from 'lucide-react';
import { ProductEntry, ReportSettings } from './types';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import SettingsForm from './components/SettingsForm';
import AuthComponent from './components/AuthComponent';
import { generatePDF } from './services/pdfGenerator';
import { exportToCSV } from './services/csvExporter';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [entries, setEntries] = useState<ProductEntry[]>([]);
  const [settings, setSettings] = useState<ReportSettings>(() => {
    const saved = localStorage.getItem('app_settings');
    const today = new Date().toISOString().split('T')[0];
    return saved ? JSON.parse(saved) : {
      companyName: 'Your Company Name',
      testerName: 'Default Tester',
      reportPrefix: 'RPT',
      tableTheme: 'striped',
      primaryFont: 'helvetica',
      uiTheme: 'light',
      reportDate: today
    };
  });
  const [activeView, setActiveView] = useState<'list' | 'form' | 'settings'>('list');

  // Check for existing session
  useEffect(() => {
    const savedSession = localStorage.getItem('app_session');
    if (savedSession) {
      setIsLoggedIn(true);
      setUserId(savedSession);
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    if (settings.uiTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      uiTheme: prev.uiTheme === 'light' ? 'dark' : 'light'
    }));
  };

  const handleLogin = (idNumber: string) => {
    setIsLoggedIn(true);
    setUserId(idNumber);
    localStorage.setItem('app_session', idNumber);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setIsLoggedIn(false);
      setUserId('');
      localStorage.removeItem('app_session');
    }
  };

  const addEntry = useCallback((entry: Omit<ProductEntry, 'id'>) => {
    const newEntry: ProductEntry = {
      ...entry,
      id: crypto.randomUUID()
    };
    setEntries(prev => [...prev, newEntry]);
    setActiveView('list');
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleDownload = async () => {
    if (entries.length === 0) {
      alert("Please add at least one entry to generate a report.");
      return;
    }
    await generatePDF(entries, settings);
  };

  const handleCSVExport = () => {
    if (entries.length === 0) {
      alert("Please add at least one entry to export.");
      return;
    }
    exportToCSV(entries, settings);
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all entries?")) {
      setEntries([]);
    }
  };

  if (!isLoggedIn) {
    return <AuthComponent onLogin={handleLogin} uiTheme={settings.uiTheme} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${settings.uiTheme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white">
              <ClipboardList size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Product Test Report</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{settings.companyName}</p>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">ID: {userId}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
              title={settings.uiTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {settings.uiTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {activeView !== 'list' ? (
              <button
                onClick={() => setActiveView('list')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActiveView('settings')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium transition-colors text-sm"
                >
                  <Settings size={16} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 rounded-lg font-medium transition-colors text-sm"
                >
                  <LogOut size={16} /> Logout
                </button>
                {entries.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg font-medium transition-colors text-sm"
                  >
                    Clear
                  </button>
                )}
              </>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {activeView === 'form' && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 transition-colors">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Add New Entry</h2>
              <ProductForm onSubmit={addEntry} />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 transition-colors">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Report Customization</h2>
              <SettingsForm settings={settings} onUpdate={(newSettings) => {
                setSettings(newSettings);
                setActiveView('list');
              }} />
            </div>
          )}

          {activeView === 'list' && (
            <div className={`flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${settings.uiTheme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              {entries.length === 0 ? (
                <div className="max-w-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-blue-600 dark:text-blue-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No entries yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Start by adding your first product test result.</p>
                  <button
                    onClick={() => setActiveView('form')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                  >
                    <Plus size={20} />
                    Add New Entry
                  </button>
                </div>
              ) : (
                <div className="w-full">
                   <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-left">Current Entries ({entries.length})</h3>
                    <button
                      onClick={() => setActiveView('form')}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md"
                    >
                      <Plus size={16} />
                      Add More
                    </button>
                  </div>
                  <ProductList entries={entries} onDelete={deleteEntry} />
                </div>
              )}
            </div>
          )}
        </main>

        {/* Persistent Bottom Actions */}
        {entries.length > 0 && activeView === 'list' && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 z-50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center gap-4">
              <button
                onClick={handleCSVExport}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-base hover:bg-blue-700 transition-all shadow-lg transform active:scale-95"
              >
                <FileSpreadsheet size={20} />
                Export CSV
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-3 bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100 dark:shadow-none transform active:scale-95"
              >
                <Download size={24} />
                Generate PDF Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
