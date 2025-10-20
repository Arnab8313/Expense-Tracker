"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  type: "income" | "expense"
}

interface ExpenseContextType {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, "id">) => void
  deleteExpense: (id: string) => void
  updateExpense: (id: string, expense: Omit<Expense, "id">) => void
  getExpensesByCategory: (category: string) => Expense[]
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getBalance: () => number
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

const STORAGE_KEY = "expenses"
const DEFAULT_EXPENSES: Expense[] = []

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setExpenses(JSON.parse(stored))
      } catch {
        setExpenses(DEFAULT_EXPENSES)
      }
    } else {
      setExpenses(DEFAULT_EXPENSES)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever expenses change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    }
  }, [expenses, isLoaded])

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses([newExpense, ...expenses])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const updateExpense = (id: string, expense: Omit<Expense, "id">) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...expense, id } : e)))
  }

  const getExpensesByCategory = (category: string) => {
    return expenses.filter((e) => e.category === category)
  }

  const getTotalIncome = () => {
    return expenses.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
  }

  const getTotalExpenses = () => {
    return expenses.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
  }

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses()
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        getExpensesByCategory,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpense() {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error("useExpense must be used within ExpenseProvider")
  }
  return context
}
