"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useReminders } from "@/context/reminders-context"
import { Bell, X, Plus, Calendar, Clock, AlertCircle } from "lucide-react"

export function RemindersDropdown() {
  const { reminders, addReminder, deleteReminder } = useReminders()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("09:00")
  const [reminderBeforeValue, setReminderBeforeValue] = useState("1")
  const [reminderBeforeUnit, setReminderBeforeUnit] = useState<"minutes" | "hours" | "days" | "weeks">("days")
  const [frequencyValue, setFrequencyValue] = useState("1")
  const [frequencyUnit, setFrequencyUnit] = useState<"minutes" | "hours" | "days" | "weeks">("hours")

  const handleOpenDropdown = () => {
    if (!dueDate) {
      const today = new Date().toISOString().split("T")[0]
      setDueDate(today)
    }
    setIsOpen(!isOpen)
  }

  const handleAddReminder = () => {
    if (title.trim() && dueDate && dueTime && reminderBeforeValue && frequencyValue) {
      addReminder({
        title: title.trim(),
        dueDate,
        dueTime,
        reminderBeforeValue: Number.parseInt(reminderBeforeValue),
        reminderBeforeUnit,
        frequencyValue: Number.parseInt(frequencyValue),
        frequencyUnit,
      })
      setTitle("")
      setDueDate("")
      setDueTime("09:00")
      setReminderBeforeValue("1")
      setReminderBeforeUnit("days")
      setFrequencyValue("1")
      setFrequencyUnit("hours")
    }
  }

  const formatReminderDisplay = (reminder: any) => {
    const date = new Date(reminder.dueDate)
    const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return `${formattedDate} at ${reminder.dueTime}`
  }

  return (
    <div className="relative">
      <Button variant="outline" size="icon" onClick={handleOpenDropdown} className="relative bg-transparent">
        <Bell className="h-4 w-4" />
        {reminders.length > 0 && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 bg-slate-800 border-slate-700 p-4 z-50 shadow-lg max-h-[700px] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Reminders</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Add Reminder Form */}
            <div className="space-y-3 pb-4 border-b border-slate-700">
              <Input
                placeholder="Reminder title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <Input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 flex-1"
                />
              </div>

              <div className="space-y-2 p-3 bg-slate-700 rounded">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  Remind me before:
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Value"
                    value={reminderBeforeValue}
                    onChange={(e) => setReminderBeforeValue(e.target.value)}
                    min="1"
                    className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400 w-20"
                  />
                  <select
                    value={reminderBeforeUnit}
                    onChange={(e) => setReminderBeforeUnit(e.target.value as any)}
                    className="bg-slate-600 border border-slate-500 text-white rounded px-2 py-1 text-sm flex-1"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
                <p className="text-xs text-slate-400">
                  Notifications start {reminderBeforeValue} {reminderBeforeUnit} before due date
                </p>
              </div>

              <div className="space-y-2 p-3 bg-slate-700 rounded">
                <label className="text-xs text-slate-300 font-medium">Notification frequency:</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Value"
                    value={frequencyValue}
                    onChange={(e) => setFrequencyValue(e.target.value)}
                    min="1"
                    className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400 w-20"
                  />
                  <select
                    value={frequencyUnit}
                    onChange={(e) => setFrequencyUnit(e.target.value as any)}
                    className="bg-slate-600 border border-slate-500 text-white rounded px-2 py-1 text-sm flex-1"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
                <p className="text-xs text-slate-400">
                  Show notification every {frequencyValue} {frequencyUnit}
                </p>
              </div>

              <Button onClick={handleAddReminder} className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>

            {/* Reminders List */}
            <div className="space-y-2">
              {reminders.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No reminders yet</p>
              ) : (
                reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start justify-between p-3 bg-slate-700 rounded text-sm hover:bg-slate-600 transition"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{reminder.title}</p>
                      <p className="text-xs text-slate-400 mt-1">Due: {formatReminderDisplay(reminder)}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Remind {reminder.reminderBeforeValue} {reminder.reminderBeforeUnit} before
                      </p>
                      <p className="text-xs text-slate-500">
                        Every {reminder.frequencyValue} {reminder.frequencyUnit}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-slate-400 hover:text-red-400 ml-2 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
