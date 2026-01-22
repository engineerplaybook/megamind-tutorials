import React, { createContext, useContext, useState } from 'react';

// 1. Create the Context
interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create the Provider
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => setUser(username);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook for easy consumption
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Consumers ---

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return <p className="text-gray-500">Please log in.</p>;

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
      <span className="font-semibold text-green-800">Welcome, {user}!</span>
      <button
        onClick={logout}
        className="px-3 py-1 bg-green-700 text-white rounded text-sm hover:bg-green-800"
      >
        Logout
      </button>
    </div>
  );
};

const LoginForm = () => {
  const { user, login } = useAuth();
  const [input, setInput] = useState('');

  if (user) return null;

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter username"
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <button
        onClick={() => {
          if (input.trim()) login(input);
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Login
      </button>
    </div>
  );
};

const Navbar = () => {
  const { user } = useAuth();
  return (
    <nav className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between">
      <span className="font-bold">My App</span>
      <span>{user ? `Logged in as ${user}` : 'Guest'}</span>
    </nav>
  );
};

// --- Main Demo Component ---
const ContextDemo = () => {
  return (
    // Wrap everything in Provider
    <AuthProvider>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <Navbar />
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-bold text-gray-700 mb-2">Login Section</h4>
            <LoginForm />
          </div>
          <div>
            <h4 className="font-bold text-gray-700 mb-2">Profile Section</h4>
            <UserProfile />
          </div>
          <p className="text-sm text-gray-500 mt-4 border-t pt-4">
             Note: `Navbar`, `LoginForm`, and `UserProfile` are independent components. They all access the same `user` state via Context without passing props down manually.
          </p>
        </div>
      </div>
    </AuthProvider>
  );
};

export default ContextDemo;
