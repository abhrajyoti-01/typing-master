"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const themes = [
  {
    name: "Dark",
    value: "dark",
    color: "#0a0c14",
    description: "Sleek dark theme with vibrant blue accents",
  },
  {
    name: "Neon",
    value: "neon",
    color: "#0e0521",
    description: "Cyberpunk-inspired with electric colors",
  },
  {
    name: "Forest",
    value: "forest",
    color: "#071409",
    description: "Rich natural greens with earthy accents",
  },
  {
    name: "Ocean",
    value: "ocean",
    color: "#051525",
    description: "Deep blues with aquatic highlights",
  },
  {
    name: "Sunset",
    value: "sunset",
    color: "#1a0a14",
    description: "Warm gradients with rich reds and oranges",
  },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="w-[100px] border-border">
        <span>Theme</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    )
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-border min-w-[90px] sm:min-w-[120px]">
          <div className="flex items-center">
            <div
              className="h-4 w-4 rounded-full mr-2 border border-border/50"
              style={{
                backgroundColor: currentTheme.color,
                boxShadow: theme === "neon" ? "0 0 5px #ff00ff80" : "none",
              }}
            />
            <span className="truncate">{currentTheme.name}</span>
          </div>
          <ChevronDown className="ml-1 sm:ml-2 h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className="flex items-center justify-between cursor-pointer py-2"
          >
            <div className="flex items-center">
              <div
                className="h-5 w-5 rounded-full mr-2 border border-border/50"
                style={{
                  backgroundColor: t.color,
                  boxShadow: t.value === "neon" ? "0 0 5px #ff00ff80" : "none",
                }}
              />
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.description}</div>
              </div>
            </div>
            {theme === t.value && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
