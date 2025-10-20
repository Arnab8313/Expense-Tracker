"use client"

import { useState, useEffect } from "react"
import { useReminders } from "@/context/reminders-context"
import { X } from "lucide-react"

export function RemindersNotifier() {
  const { reminders, markReminderShown } = useReminders()
  const [activeReminder, setActiveReminder] = useState<string | null>(null)

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()

      reminders.forEach((reminder) => {
        const reminderDateTime = new Date(`${reminder.dueDate}T${reminder.dueTime}`)
        const lastShown = reminder.lastShownAt ? new Date(reminder.lastShownAt) : null

        let reminderBeforeMs = reminder.reminderBeforeValue * 60 * 1000 // default to minutes
        if (reminder.reminderBeforeUnit === "hours") {
          reminderBeforeMs = reminder.reminderBeforeValue * 60 * 60 * 1000
        } else if (reminder.reminderBeforeUnit === "days") {
          reminderBeforeMs = reminder.reminderBeforeValue * 24 * 60 * 60 * 1000
        } else if (reminder.reminderBeforeUnit === "weeks") {
          reminderBeforeMs = reminder.reminderBeforeValue * 7 * 24 * 60 * 60 * 1000
        }

        let frequencyMs = reminder.frequencyValue * 60 * 1000 // default to minutes
        if (reminder.frequencyUnit === "hours") {
          frequencyMs = reminder.frequencyValue * 60 * 60 * 1000
        } else if (reminder.frequencyUnit === "days") {
          frequencyMs = reminder.frequencyValue * 24 * 60 * 60 * 1000
        } else if (reminder.frequencyUnit === "weeks") {
          frequencyMs = reminder.frequencyValue * 7 * 24 * 60 * 60 * 1000
        }

        // Calculate when reminder window starts
        const reminderStartTime = new Date(reminderDateTime.getTime() - reminderBeforeMs)

        // Check if we're in the reminder window
        const isInReminderWindow = now >= reminderStartTime && now <= reminderDateTime
        const timeSinceLastShown = lastShown ? now.getTime() - lastShown.getTime() : Number.POSITIVE_INFINITY
        const isTimeToShow = timeSinceLastShown >= frequencyMs

        if (isInReminderWindow && isTimeToShow) {
          setActiveReminder(reminder.id)
          markReminderShown(reminder.id)

          // Auto-hide after 5 seconds
          const timer = setTimeout(() => {
            setActiveReminder(null)
          }, 5000)

          return () => clearTimeout(timer)
        }
      })
    }

    // Check immediately on mount
    checkReminders()

    // Check every minute
    const interval = setInterval(checkReminders, 60000)

    return () => clearInterval(interval)
  }, [reminders, markReminderShown])

  const currentReminder = reminders.find((r) => r.id === activeReminder)

  if (!currentReminder) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between gap-4 max-w-sm">
        <div>
          <p className="font-semibold">{currentReminder.title}</p>
          <p className="text-sm text-blue-100">
            {currentReminder.dueDate} at {currentReminder.dueTime}
          </p>
        </div>
        <button onClick={() => setActiveReminder(null)} className="text-blue-100 hover:text-white flex-shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
