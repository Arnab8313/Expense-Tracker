"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useExpense } from "@/context/expense-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { convertDDMMYYYYToISO, convertISOToDDMMYYYY } from "@/lib/date-utils"
import { CalendarIcon } from "lucide-react"

const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Entertainment", "Health", "Other"]
const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Other"]

interface ExpenseFormProps {
  editingId?: string | null
  onEditComplete?: () => void
}

export function ExpenseForm({ editingId, onEditComplete }: ExpenseFormProps) {
  const { addExpense, updateExpense, expenses } = useExpense()
  const [formData, setFormData] = useState(() => {
    if (editingId) {
      const expense = expenses.find((e) => e.id === editingId)
      if (expense) {
        return {
          description: expense.description,
          amount: expense.amount.toString(),
          category: CATEGORIES.includes(expense.category) ? expense.category : "Other",
          date: convertISOToDDMMYYYY(expense.date),
          type: expense.type as "income" | "expense",
        }
      }
    }
    return {
      description: "",
      amount: "",
      category: "Food",
      date: convertISOToDDMMYYYY(new Date().toISOString().split("T")[0]),
      type: "expense" as const,
    }
  })

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const [day, month, year] = formData.date.split("/")
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
  })

  const [customCategory, setCustomCategory] = useState(() => {
    if (editingId) {
      const expense = expenses.find((e) => e.id === editingId)
      if (expense && expense.type === "income") {
        return expense.category
      } else if (expense && expense.type === "expense" && !CATEGORIES.includes(expense.category)) {
        return expense.category
      }
    }
    return ""
  })

  useEffect(() => {
    if (!editingId) {
      setFormData({
        description: "",
        amount: "",
        category: "Food",
        date: convertISOToDDMMYYYY(new Date().toISOString().split("T")[0]),
        type: "expense",
      })
      setCustomCategory("")
      setSelectedDate(new Date())
    }
  }, [editingId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.date) return

    const isoDate = convertDDMMYYYYToISO(formData.date)

    let finalCategory = formData.category
    if (formData.type === "income") {
      finalCategory = customCategory || "Income"
    } else if (formData.category === "Other" && customCategory) {
      finalCategory = customCategory
    }

    const expenseData = {
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      category: finalCategory,
      date: isoDate,
      type: formData.type,
    }

    if (editingId) {
      updateExpense(editingId, expenseData)
      onEditComplete?.()
    } else {
      addExpense(expenseData)
      setFormData({
        description: "",
        amount: "",
        category: "Food",
        date: convertISOToDDMMYYYY(new Date().toISOString().split("T")[0]),
        type: "expense",
      })
      setCustomCategory("")
      setSelectedDate(new Date())
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      setFormData({ ...formData, date: `${day}/${month}/${year}` })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-slate-300">
            Type
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => {
              setFormData({ ...formData, type: value as "income" | "expense" })
              setCustomCategory("")
            }}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="expense" className="text-white">
                Expense
              </SelectItem>
              <SelectItem value="income" className="text-white">
                Income
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-slate-300">
            Description
          </Label>
          <Input
            id="description"
            placeholder="e.g., Grocery shopping"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-slate-300">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:appearance-textfield"
          />
        </div>

        {formData.type === "expense" ? (
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-300">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20 transition-colors">
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
        ) : (
          <div className="space-y-2">
            <Label htmlFor="incomeCategory" className="text-slate-300">
              Income Category
            </Label>
            <Input
              id="incomeCategory"
              placeholder="e.g., Salary, Freelance, Investment"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
            />
          </div>
        )}

        {formData.type === "expense" && formData.category === "Other" && (
          <div className="space-y-2">
            <Label htmlFor="customCategory" className="text-slate-300">
              Custom Category
            </Label>
            <Input
              id="customCategory"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="date" className="text-slate-300">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-700 border-slate-600" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date > new Date()}
                className="bg-slate-700"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
      >
        {editingId ? "Update Transaction" : "Add Transaction"}
      </Button>
    </form>
  )
}
