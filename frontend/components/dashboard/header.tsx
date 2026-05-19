"use client";

import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Menu, Bell, Search, LogOut } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useUser();
  const [showMenu, setShowMenu] = useState(false);

  const initials = user
    ? ((user.firstName?.charAt(0) || "") + (user.lastName?.charAt(0) || "")).toUpperCase() ||
      user.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() ||
      "U"
    : "U";

  const displayName =
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "User";

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-zinc-800 text-zinc-400"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">{initials}</span>
            </div>
            <span className="hidden sm:block text-sm text-white">
              {displayName}
            </span>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl border border-zinc-800 shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-zinc-800">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded text-xs">
                    Admin
                  </span>
                </div>
                <div className="p-2">
                  <SignOutButton>
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("user-signed-out"));
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
