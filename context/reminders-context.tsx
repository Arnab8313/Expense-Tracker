"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Reminder {
  id: string
  title: string
  dueDate: string // ISO date string (YYYY-MM-DD)
  dueTime: string // HH:mm format
  reminderBeforeValue: number
  reminderBeforeUnit: "minutes" | "hours" | "days" | "weeks"
  frequencyValue: number
  frequencyUnit: "minutes" | "hours" | "days" | "weeks"
  createdAt: string
  lastShownAt?: string
}

interface RemindersContextType {
  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, "id" | "createdAt">) => void
  deleteReminder: (id: string) => void
  updateReminder: (id: string, reminder: Omit<Reminder, "id" | "createdAt">) => void
  markReminderShown: (id: string) => void
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined)

const REMINDERS_STORAGE_KEY = "reminders"

export function RemindersProvider({ children }: { children: React.ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(REMINDERS_STORAGE_KEY)
    if (stored) {
      try {
        setReminders(JSON.parse(stored))
      } catch {
        setReminders([])
      }
    } else {
      setReminders([])
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever reminders change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders))
    }
  }, [reminders, isLoaded])

  const addReminder = (reminder: Omit<Reminder, "id" | "createdAt">) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setReminders([newReminder, ...reminders])
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id))
  }

  const updateReminder = (id: string, reminder: Omit<Reminder, "id" | "createdAt">) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, ...reminder } : r)))
  }

  const markReminderShown = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, lastShownAt: new Date().toISOString() } : r)))
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <RemindersContext.Provider
      value={{
        reminders,
        addReminder,
        deleteReminder,
        updateReminder,
        markReminderShown,
      }}
    >
      {children}
    </RemindersContext.Provider>
  )
}

export function useReminders() {
  const context = useContext(RemindersContext)
  if (!context) {
    throw new Error("useReminders must be used within RemindersProvider")
  }
  return context
}
