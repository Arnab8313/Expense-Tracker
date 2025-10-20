"use client"

import { useExpense } from "@/context/expense-context"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

export function SummaryCards() {
  const { getTotalIncome, getTotalExpenses, getBalance } = useExpense()

  const income = getTotalIncome()
  const expenses = getTotalExpenses()
  const balance = getBalance()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Income Card */}
      <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-700 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-emerald-200 text-xs sm:text-sm font-medium mb-1">Total Income</p>
            <p className="text-2xl sm:text-3xl font-bold text-white truncate">{formatCurrency(income)}</p>
          </div>
          <div className="bg-emerald-700 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-200" />
          </div>
        </div>
      </Card>

      {/* Expenses Card */}
      <Card className="bg-gradient-to-br from-red-900 to-red-800 border-red-700 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-red-200 text-xs sm:text-sm font-medium mb-1">Total Expenses</p>
            <p className="text-2xl sm:text-3xl font-bold text-white truncate">{formatCurrency(expenses)}</p>
          </div>
          <div className="bg-red-700 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-200" />
          </div>
        </div>
      </Card>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-blue-200 text-xs sm:text-sm font-medium mb-1">Balance</p>
            <p className="text-2xl sm:text-3xl font-bold text-white truncate">{formatCurrency(balance)}</p>
          </div>
          <div className="bg-blue-700 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200" />
          </div>
        </div>
      </Card>
    </div>
  )
}
