"use client"

import { useExpense } from "@/context/expense-context"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const COLORS = ["#f97316", "#a855f7", "#ef4444", "#ec4899", "#eab308", "#10b981", "#6366f1"]

export function CategoryChart() {
  const { expenses } = useExpense()

  const categoryData = expenses
    .filter((e) => e.type === "expense")
    .reduce(
      (acc, expense) => {
        const existing = acc.find((item) => item.name === expense.category)
        if (existing) {
          existing.value += expense.amount
        } else {
          acc.push({ name: expense.category, value: expense.amount })
        }
        return acc
      },
      [] as Array<{ name: string; value: number }>,
    )
    .sort((a, b) => b.value - a.value)

  if (categoryData.length === 0) {
    return <p className="text-slate-400 text-center py-8">No expense data available</p>
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 space-y-2">
        <h3 className="text-sm font-semibold text-slate-300">Category Breakdown</h3>
        <div className="space-y-1">
          {categoryData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-slate-300">{item.name}</span>
              </div>
              <span className="text-slate-400">{item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
