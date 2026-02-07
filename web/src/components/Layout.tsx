import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  BookOpen, 
  Edit3,
  Menu,
  X,
  LogOut,
  User,
  Brain,
  Target,
  Crown,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { AIAssistantModal } from './AIAssistantModal';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/trades', label: 'Trades', icon: TrendingUp },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/journal', label: 'Journal', icon: Edit3 },
  { path: '/learning', label: 'Learning', icon: BookOpen },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { openAIAssistant } = useAI();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 lg:hidden transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {/* Logo */}
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                  <Target className="text-white" size={24} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Golden Passage
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Pro Trading Platform</p>
                </div>
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-300 font-medium">{user.email?.split('@')[0]}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-red-900/30 border border-gray-700/50 hover:border-red-700/50 text-gray-300 hover:text-red-400 transition-all"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Glassmorphism Sidebar */}
        <aside 
          className={`fixed lg:sticky inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:transform-none lg:top-16 lg:h-[calc(100vh-4rem)]
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="h-full backdrop-blur-xl bg-gray-900/90 lg:bg-transparent border-r border-gray-800/50 p-4 overflow-y-auto">
            {/* Navigation */}
            <nav className="space-y-1">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Menu
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-500/20' 
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-orange-400 transition-colors'} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Premium Upgrade Section */}
            <div className="mt-6">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Subscription
              </p>
              <div className="mt-2 p-4 rounded-xl bg-gradient-to-br from-orange-600/20 to-purple-600/20 border border-orange-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="text-orange-400" size={20} />
                  <span className="font-medium text-white">Free Trial</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Upgrade to Premium for unlimited AI access and advanced features
                </p>
                <button 
                  onClick={() => {
                    navigate('/subscription');
                    setSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  Upgrade to Premium
                </button>
              </div>
            </div>

            {/* AI Trade Assistant Section */}
            <div className="mt-6">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                AI Assistant
              </p>
              <div className="mt-2 p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="text-purple-400" size={20} />
                  <span className="font-medium text-white">AI Trade Assistant</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Get AI-powered trade analysis and strategy recommendations
                </p>
                <button 
                  onClick={() => {
                    openAIAssistant();
                    setSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-sm transition-colors"
                >
                  Ask AI Assistant
                </button>
              </div>
            </div>

            {/* Logout for mobile */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 mt-8 rounded-xl text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors lg:hidden"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
          <div className="backdrop-blur-sm">
            {children}
          </div>
        </main>
      </div>
      
      {/* AI Assistant Modal - Available Globally */}
      <AIAssistantModal />
    </div>
  );
}
