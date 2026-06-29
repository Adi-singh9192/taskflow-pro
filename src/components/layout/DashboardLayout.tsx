import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, CheckSquare, Bell, Search, Menu, X, Award, Trophy, Wallet, Sparkles } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Boards', path: '/boards', icon: CheckSquare },
    { name: 'Reward Engine', path: '/rewards', icon: Award },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Coupon Wallet', path: '/wallet', icon: Wallet },
    { name: 'Achievements', path: '/achievements', icon: Sparkles },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-background)] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-[var(--color-border)] flex-col p-6 z-20 bg-[var(--color-background)]">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shrink-0">
            <div className="w-4 h-4 bg-black rounded-sm"></div>
          </div>
          <span className="font-heading font-bold text-xl tracking-tight truncate">TaskFlow Pro</span>
        </div>

        <div className="flex-1">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[var(--color-hover)] text-[var(--color-primary)] border border-[var(--color-border)]" 
                    : "text-[var(--color-text-muted)] hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto">
          <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">AI Credits</span>
              <span className="text-[10px] text-[var(--color-primary)] font-mono">85%</span>
            </div>
            <div className="w-full h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-primary)] w-[85%]"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-hover)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <span className="text-xs font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.name}</span>
              <span className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors w-full px-2"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-[var(--color-border)] flex items-center justify-between px-4 md:px-8 bg-[var(--color-background)] shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative flex-1 max-w-xl hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search tasks, boards..." 
                className="w-full sm:w-80 h-9 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg pl-10 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="bg-[var(--color-border)] text-[10px] px-1.5 py-0.5 rounded text-[var(--color-text-muted)] hidden lg:inline-block">⌘</kbd>
                <kbd className="bg-[var(--color-border)] text-[10px] px-1.5 py-0.5 rounded text-[var(--color-text-muted)] hidden lg:inline-block">K</kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 ml-4">
            <button className="relative text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[var(--color-secondary)] border-2 border-[var(--color-background)]"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold">{user?.name}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">Product Lead</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] border border-[var(--color-border)] shrink-0"></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-card)] border-t border-[var(--color-border)] z-30 pb-safe">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive 
                  ? "text-[var(--color-primary)]" 
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </NavLink>
          ))}
          <button 
            onClick={logout}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Mobile Overlay Menu (Optional if we want search/credits on mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[var(--color-background)] p-4 pt-16 flex flex-col">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="mb-8">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search tasks, boards..." 
                className="w-full h-10 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
              />
            </div>
          </div>
          
          <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl mb-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">AI Credits</span>
              <span className="text-[10px] text-[var(--color-primary)] font-mono">85%</span>
            </div>
            <div className="w-full h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-primary)] w-[85%]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
