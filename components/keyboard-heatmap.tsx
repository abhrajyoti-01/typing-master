"use client"

import { memo } from "react"
import { motion } from "framer-motion"

interface KeyboardHeatmapProps {
  keyErrors: Record<string, number>
}

const KeyboardHeatmap = memo(function KeyboardHeatmap({ keyErrors }: KeyboardHeatmapProps) {
  // Define keyboard layout
  const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ]

  // Find the maximum error count for normalization
  const maxErrors = Math.max(1, ...Object.values(keyErrors))

  // Get color intensity based on error count
  const getKeyColor = (key: string) => {
    const errorCount = keyErrors[key] || 0
    const intensity = errorCount / maxErrors

    // Return a color from green (no errors) to red (max errors)
    if (intensity === 0) return "bg-primary/10 hover:bg-primary/20 border-primary/20"
    if (intensity < 0.3) return "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30"
    if (intensity < 0.6) return "bg-orange-500/30 hover:bg-orange-500/40 border-orange-500/40"
    return "bg-destructive/30 hover:bg-destructive/40 border-destructive/40"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-border bg-card"
    >
      <h3 className="text-lg font-semibold mb-4">Keyboard Heatmap</h3>
      <p className="text-sm text-muted-foreground mb-4">
        This heatmap shows which keys you struggle with the most. Redder keys indicate more errors.
      </p>

      <div className="flex flex-col items-center gap-1 mb-2">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {rowIndex === 1 && <div className="w-2 sm:w-4"></div>}
            {rowIndex === 2 && <div className="w-4 sm:w-8"></div>}

            {row.map((key) => {
              const errorCount = keyErrors[key] || 0

              return (
                <div
                  key={key}
                  className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md border ${getKeyColor(key)} transition-colors`}
                >
                  <div className="flex flex-col items-center">
                    <span className="uppercase text-xs sm:text-sm">{key}</span>
                    {errorCount > 0 && (
                      <span className="text-[8px] sm:text-[10px] text-muted-foreground font-mono">{errorCount}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-2">
        <div className="w-32 h-7 sm:w-40 sm:h-9 flex items-center justify-center rounded-md border border-border bg-card/50 hover:bg-card/80 transition-colors text-xs sm:text-sm">
          space
        </div>
      </div>
    </motion.div>
  )
})

export default KeyboardHeatmap
