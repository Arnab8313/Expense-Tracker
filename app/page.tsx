"use client"

import { useState, useEffect } from "react"
import { ExpenseProvider } from "@/context/expense-context"
import { RemindersProvider } from "@/context/reminders-context"
import { Dashboard } from "@/components/dashboard"
import { RemindersNotifier } from "@/components/reminders-notifier"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <RemindersProvider>
      <ExpenseProvider>
        <Dashboard />
        <RemindersNotifier />
      </ExpenseProvider>
    </RemindersProvider>
  )
}
