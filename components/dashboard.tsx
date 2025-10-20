"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ExpenseForm } from "./expense-form"
import { ExpenseList } from "./expense-list"
import { SummaryCards } from "./summary-cards"
import { CategoryChart } from "./category-chart"
import { TrendChart } from "./trend-chart"
<<<<<<< HEAD
import { RemindersDropdown } from "./reminders-dropdown"
=======
>>>>>>> d0a275b96b74174a36c1c399e1d7f33f7bc59ae6

export function Dashboard() {
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleEditClick = (id: string) => {
    setEditingId(id)
    // Scroll to form on mobile
    setTimeout(() => {
      document.querySelector("#expense-form")?.scrollIntoView({ behavior: "smooth" })
    }, 0)
  }

  const handleEditComplete = () => {
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
<<<<<<< HEAD
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Expense Tracker</h1>
            <p className="text-sm sm:text-base text-slate-400">Manage your finances and track spending habits</p>
          </div>
          <RemindersDropdown />
=======
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Expense Tracker</h1>
          <p className="text-sm sm:text-base text-slate-400">Manage your finances and track spending habits</p>
>>>>>>> d0a275b96b74174a36c1c399e1d7f33f7bc59ae6
        </div>

        {/* Summary Cards */}
        <SummaryCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {/* Left Column - Form and List */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="bg-slate-800 border-slate-700 p-4 sm:p-6 transition-all duration-200" id="expense-form">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
                {editingId ? "Edit Transaction" : "Add Transaction"}
              </h2>
              <ExpenseForm editingId={editingId} onEditComplete={handleEditComplete} />
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Recent Transactions</h2>
              <ExpenseList onEditClick={handleEditClick} />
            </Card>
          </div>

          {/* Right Column - Charts */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-slate-800 border-slate-700 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Category Breakdown</h2>
              <CategoryChart />
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Spending Trend</h2>
              <TrendChart />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
