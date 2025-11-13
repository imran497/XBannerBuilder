'use client'

import { Moon, Sun } from "lucide-react"

interface PreviewThemeSwitchProps {
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
}

export function PreviewThemeSwitch({ theme, onThemeChange }: PreviewThemeSwitchProps) {
  return (
    <button
      onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
      className="relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      style={{
        backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9'
      }}
      aria-label="Toggle preview theme"
    >
      <span
        className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
        }`}
      >
        {theme === 'light' ? (
          <Sun className="h-4 w-4 text-amber-500" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700" />
        )}
      </span>
    </button>
  )
}
