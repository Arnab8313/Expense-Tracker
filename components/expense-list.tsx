"use client"

import { useState } from "react"
import { useExpense } from "@/context/expense-context"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDateDisplay } from "@/lib/date-utils"

const CATEGORIES = ["All", "Food", "Travel", "Bills", "Shopping", "Entertainment", "Health", "Other", "Income"]

interface ExpenseListProps {
  onEditClick?: (id: string) => void
}

export function ExpenseList({ onEditClick }: ExpenseListProps) {
  const { expenses, deleteExpense } = useExpense()
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredExpenses =
    selectedCategory === "All" ? expenses : expenses.filter((e) => e.category === selectedCategory)

  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-orange-500/20 text-orange-300",
      Travel: "bg-purple-500/20 text-purple-300",
      Bills: "bg-red-500/20 text-red-300",
      Shopping: "bg-pink-500/20 text-pink-300",
      Entertainment: "bg-yellow-500/20 text-yellow-300",
      Health: "bg-green-500/20 text-green-300",
      Income: "bg-emerald-500/20 text-emerald-300",
      Other: "bg-slate-500/20 text-slate-300",
    }
    return colors[category] || "bg-slate-500/20 text-slate-300"
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-white">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {sortedExpenses.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No transactions found</p>
        ) : (
          sortedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getCategoryColor(expense.category)}`}
                  >
                    {expense.category}
                  </span>
                  <span className="text-slate-400 text-xs">{formatDateDisplay(expense.date)}</span>
                </div>
                <p className="text-white font-medium truncate">{expense.description}</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <p
                  className={`text-lg font-bold whitespace-nowrap ${expense.type === "income" ? "text-emerald-400" : "text-red-400"}`}
                >
                  {expense.type === "income" ? "+" : "-"}
                  {formatCurrency(expense.amount)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditClick?.(expense.id)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteExpense(expense.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
