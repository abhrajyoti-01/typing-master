"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

interface TypingInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputRef: React.RefObject<HTMLInputElement>
  disabled: boolean
}

export default function TypingInput({ value, onChange, inputRef, disabled }: TypingInputProps) {
  // Prevent copy and paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
  }

  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault()
  }

  const handleCut = (e: React.ClipboardEvent) => {
    e.preventDefault()
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoFocus
        className="bg-background border-border focus-visible:ring-primary text-foreground"
        placeholder="Start typing here..."
        onPaste={handlePaste}
        onCopy={handleCopy}
        onCut={handleCut}
        onContextMenu={handleContextMenu}
      />
    </motion.div>
  )
}
