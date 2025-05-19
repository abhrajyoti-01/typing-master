"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export default function GitHubButton() {
  const handleClick = () => {
    window.open("https://github.com/abhrajyoti-01/typing-master", "_blank")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="gap-1 sm:gap-2 text-xs sm:text-sm"
    >
      <Github size={16} className="w-3 h-3 sm:w-4 sm:h-4" />
      <span suppressHydrationWarning className="hidden sm:inline">Fork on GitHub</span>
      <span suppressHydrationWarning className="inline sm:hidden">GitHub</span>
    </Button>
  )
}
