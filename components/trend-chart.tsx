"use client"

import { useExpense } from "@/context/expense-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatDateDisplay } from "@/lib/date-utils"

export function TrendChart() {
  const { expenses } = useExpense()

  // Group expenses by date and calculate daily totals
  const dailyData = expenses
    .reduce(
      (acc, expense) => {
        const existing = acc.find((item) => item.date === expense.date)
        if (existing) {
          if (expense.type === "expense") {
            existing.expenses += expense.amount
          } else {
            existing.income += expense.amount
          }
        } else {
          acc.push({
            date: expense.date,
            expenses: expense.type === "expense" ? expense.amount : 0,
            income: expense.type === "income" ? expense.amount : 0,
          })
        }
        return acc
      },
      [] as Array<{ date: string; expenses: number; income: number }>,
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7) // Last 7 days

  if (dailyData.length === 0) {
    return <p className="text-slate-400 text-center py-8">No trend data available</p>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dailyData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          style={{ fontSize: "12px" }}
          tickFormatter={(date) => formatDateDisplay(date)}
        />
        <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
          formatter={(value) => `${value.toFixed(2)}`}
          labelStyle={{ color: "#e2e8f0" }}
          labelFormatter={(date) => formatDateDisplay(date)}
        />
        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444" }} />
        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
