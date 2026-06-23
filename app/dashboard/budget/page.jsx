"use client";
import { useState } from "react";
import { Plus, DollarSign, TrendingUp, TrendingDown, PieChart, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
const budgetCategories = [
    { id: 1, name: "Venue", allocated: 15000, spent: 12500, color: "bg-emerald-500" },
    { id: 2, name: "Catering", allocated: 8000, spent: 7200, color: "bg-blue-500" },
    { id: 3, name: "Photography", allocated: 5000, spent: 5000, color: "bg-purple-500" },
    { id: 4, name: "Decorations", allocated: 3500, spent: 2800, color: "bg-amber-500" },
    { id: 5, name: "Entertainment", allocated: 4000, spent: 3500, color: "bg-pink-500" },
    { id: 6, name: "Flowers", allocated: 2500, spent: 2200, color: "bg-rose-500" },
    { id: 7, name: "Attire", allocated: 3000, spent: 2800, color: "bg-cyan-500" },
    { id: 8, name: "Miscellaneous", allocated: 2000, spent: 1500, color: "bg-gray-500" },
];
const expenses = [
    { id: 1, description: "Venue deposit", category: "Venue", amount: 5000, date: "2024-01-15", vendor: "Grand Ballroom" },
    { id: 2, description: "Catering advance", category: "Catering", amount: 3000, date: "2024-01-20", vendor: "Elite Catering" },
    { id: 3, description: "Photographer booking", category: "Photography", amount: 2500, date: "2024-01-22", vendor: "Studio Pro" },
    { id: 4, description: "Floral arrangements", category: "Flowers", amount: 1200, date: "2024-02-01", vendor: "Bloom & Co" },
    { id: 5, description: "DJ deposit", category: "Entertainment", amount: 1500, date: "2024-02-05", vendor: "Beat Masters" },
];
export default function BudgetPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
    const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
    const remaining = totalAllocated - totalSpent;
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Budget Management</h1>
          <p className="text-muted-foreground">Track and manage your event expenses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
              <Plus className="mr-2 h-4 w-4"/>
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-background">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>Record a new expense for your event budget.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="expense-description">Description</Label>
                <Input id="expense-description" placeholder="Enter expense description" className="border-white/10 bg-white/5"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-amount">Amount</Label>
                  <Input id="expense-amount" type="number" placeholder="0.00" className="border-white/10 bg-white/5"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-category">Category</Label>
                  <Select>
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue placeholder="Select"/>
                    </SelectTrigger>
                    <SelectContent>
                      {budgetCategories.map((cat) => (<SelectItem key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-date">Date</Label>
                  <Input id="expense-date" type="date" className="border-white/10 bg-white/5"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-vendor">Vendor</Label>
                  <Input id="expense-vendor" placeholder="Vendor name" className="border-white/10 bg-white/5"/>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/10">Cancel</Button>
              <Button className="bg-emerald-500 text-black hover:bg-emerald-400" onClick={() => setIsDialogOpen(false)}>Add Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
              <DollarSign className="h-5 w-5 text-emerald-400"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold text-foreground">${totalAllocated.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <TrendingDown className="h-5 w-5 text-blue-400"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
              <TrendingUp className="h-5 w-5 text-amber-400"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-foreground">${remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
              <PieChart className="h-5 w-5 text-purple-400"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget Used</p>
              <p className="text-2xl font-bold text-foreground">{Math.round((totalSpent / totalAllocated) * 100)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Budget by Category</h2>
        <div className="space-y-4">
          {budgetCategories.map((category) => (<div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{category.name}</span>
                <span className="text-muted-foreground">
                  ${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                <div className={`absolute left-0 top-0 h-full ${category.color} transition-all`} style={{ width: `${Math.min((category.spent / category.allocated) * 100, 100)}%` }}/>
              </div>
            </div>))}
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="border-b border-white/10 p-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Expenses</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-muted-foreground">Description</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground">Vendor</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-right text-muted-foreground">Amount</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (<TableRow key={expense.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="font-medium text-foreground">{expense.description}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-foreground">
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{expense.vendor}</TableCell>
                <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                <TableCell className="text-right font-medium text-emerald-400">
                  ${expense.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit2 className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400">
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </div>
    </div>);
}
