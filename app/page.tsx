"use client"

import { useState, useEffect } from "react"
import { ExpenseProvider } from "@/context/expense-context"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ExpenseProvider>
      <Dashboard />
    </ExpenseProvider>
  )
}
