"use client"

import { useState, useEffect } from "react"
import { ExpenseProvider } from "@/context/expense-context"
<<<<<<< HEAD
import { RemindersProvider } from "@/context/reminders-context"
import { Dashboard } from "@/components/dashboard"
import { RemindersNotifier } from "@/components/reminders-notifier"
=======
import { Dashboard } from "@/components/dashboard"
>>>>>>> d0a275b96b74174a36c1c399e1d7f33f7bc59ae6

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
<<<<<<< HEAD
    <RemindersProvider>
      <ExpenseProvider>
        <Dashboard />
        <RemindersNotifier />
      </ExpenseProvider>
    </RemindersProvider>
=======
    <ExpenseProvider>
      <Dashboard />
    </ExpenseProvider>
>>>>>>> d0a275b96b74174a36c1c399e1d7f33f7bc59ae6
  )
}
