"use client"

import { motion } from "framer-motion"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      className="mt-8 py-4 border-t border-border text-center text-xs sm:text-sm text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <p>
          © {currentYear} TypeMaster by <span className="font-medium text-primary">Abhra</span>. All rights reserved.
        </p>
      </div>
    </motion.footer>
  )
}
