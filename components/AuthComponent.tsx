
import React, { useState, useEffect } from 'react';
import { Lock, User, ClipboardList, ArrowRight, ArrowLeft, UserPlus, HelpCircle } from 'lucide-react';

interface AuthComponentProps {
  onLogin: (idNumber: string) => void;
  uiTheme?: 'light' | 'dark';
}

type AuthMode = 'signin' | 'signup' | 'forgot';

const AuthComponent: React.FC<AuthComponentProps> = ({ onLogin, uiTheme = 'light' }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize simulated users if not present
  useEffect(() => {
    if (!localStorage.getItem('app_users')) {
      localStorage.setItem('app_users', JSON.stringify([{ id: '12345', password: 'password' }]));
    }
  }, []);

  const getUsers = () => JSON.parse(localStorage.getItem('app_users') || '[]');
  const saveUsers = (users: any[]) => localStorage.setItem('app_users', JSON.stringify(users));

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const user = users.find((u: any) => u.id === idNumber && u.password === password);

      if (user) {
        onLogin(idNumber);
      } else {
        setError('Invalid ID Number or password.');
        setLoading(false);
      }
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      if (users.find((u: any) => u.id === idNumber)) {
        setError('This ID Number is already registered.');
        setLoading(false);
        return;
      }

      users.push({ id: idNumber, password });
      saveUsers(users);
      setSuccess('Account created successfully! Please Sign In.');
      setMode('signin');
      setLoading(false);
      setPassword('');
      setConfirmPassword('');
    }, 800);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const userIndex = users.findIndex((u: any) => u.id === idNumber);

      if (userIndex === -1) {
        setError('ID Number not found.');
        setLoading(false);
        return;
      }

      // Simulation: simply reset to 'password' for demo purposes
      users[userIndex].password = 'password';
      saveUsers(users);
      setSuccess('Password has been reset to default "password".');
      setMode('signin');
      setLoading(false);
    }, 800);
  };

  const inputClasses = "w-full pl-10 p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const labelClasses = "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider";

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1">
              <label className={labelClasses}>ID Number</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className={inputClasses} placeholder="Create ID (e.g. 54321)" />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} placeholder="Create password" />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClasses} placeholder="Repeat password" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
              {loading ? 'Registering...' : 'Sign Up'} <UserPlus size={20} />
            </button>
            <button type="button" onClick={() => setMode('signin')} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">
              <ArrowLeft size={16} /> Back to Sign In
            </button>
          </form>
        );
      case 'forgot':
        return (
          <form onSubmit={handleForgot} className="space-y-6">
            <div className="space-y-1">
              <label className={labelClasses}>ID Number</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className={inputClasses} placeholder="Enter your ID Number" />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 italic">* We will reset your password to "password" for simulation.</p>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
              {loading ? 'Processing...' : 'Reset Password'} <HelpCircle size={20} />
            </button>
            <button type="button" onClick={() => setMode('signin')} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">
              <ArrowLeft size={16} /> Back to Sign In
            </button>
          </form>
        );
      default:
        return (
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-1">
              <label className={labelClasses}>ID Number</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className={inputClasses} placeholder="e.g. 12345" />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} placeholder="••••••••" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setMode('forgot')} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Forgot Password?
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={20} />
            </button>
            <div className="text-center pt-2">
              <span className="text-sm text-gray-400 dark:text-gray-500">New user? </span>
              <button type="button" onClick={() => setMode('signup')} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Sign Up
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${uiTheme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} px-4`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200 dark:shadow-none">
            <ClipboardList className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Recovery'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            {mode === 'signin' ? 'Access your product test reports' : mode === 'signup' ? 'Join our test reporting platform' : 'Reset your account password'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-200 dark:shadow-none border border-gray-100 dark:border-gray-800 transition-colors">
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium animate-pulse">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium">
              {success}
            </div>
          )}
          
          {renderForm()}
        </div>
        
        <p className="text-center text-gray-400 dark:text-gray-600 text-xs mt-8">
          &copy; 2024 Product Test Manager. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthComponent;
