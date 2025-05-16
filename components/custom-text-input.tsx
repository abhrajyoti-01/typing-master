"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface CustomTextInputProps {
  onSubmit: (text: string) => void
  onCancel: () => void
}

export default function CustomTextInput({ onSubmit, onCancel }: CustomTextInputProps) {
  const [text, setText] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (text.trim().length < 10) {
      setError("Text must be at least 10 characters long")
      return
    }

    onSubmit(text.trim())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold">Enter Custom Text</h3>
      <p className="text-sm text-muted-foreground">
        Enter your own text to practice with. It should be at least 10 characters long.
      </p>

      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          if (error) setError("")
        }}
        placeholder="Enter your custom text here..."
        className="min-h-[100px] bg-background border-border"
        autoFocus
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} className="border-border">
          <X size={16} className="mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Check size={16} className="mr-2" />
          Use This Text
        </Button>
      </div>
    </motion.div>
  )
}
