"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Calendar, CheckSquare, Pencil, Trash2, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { readJsonResponse } from "@/lib/safe-json";
export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const loadTasks = async () => {
            const response = await fetch("/api/tasks");
            const data = await readJsonResponse(response);
            setTasks(data ?? []);
            setIsLoading(false);
        };
        loadTasks();
    }, []);
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.ceremony.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" || task.status.toLowerCase().replace(" ", "-") === filter;
        return matchesSearch && matchesFilter;
    });
    const PAGE_SIZE = 5;
    const pageCount = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
    const paginatedTasks = filteredTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const handleDelete = (id) => {
        const deleteTask = async () => {
            await fetch(`/api/tasks/${id}`, { method: "DELETE" });
            setTasks(tasks.filter(t => t.id !== id));
        };
        deleteTask();
    };
    const toggleStatus = (id) => {
        const updateTaskStatus = async () => {
            const task = tasks.find((item) => item.id === id);
            if (!task)
                return;
            const nextStatus = {
                "Todo": "In Progress",
                "In Progress": "Done",
                "Done": "Todo"
            };
            const updated = { ...task, status: nextStatus[task.status] };
            await fetch(`/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });
            setTasks(tasks.map((item) => (item.id === id ? updated : item)));
        };
        updateTaskStatus();
    };
    const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === "Todo").length,
        inProgress: tasks.filter(t => t.status === "In Progress").length,
        done: tasks.filter(t => t.status === "Done").length,
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display">Tasks</h1>
          <p className="text-muted-foreground mt-1">Track and manage your planning tasks</p>
        </div>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full" asChild>
          <Link href="/dashboard/tasks/new">
            <Plus className="w-4 h-4 mr-2"/>
            Add Task
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-foreground/10 p-4">
          <div className="text-2xl font-display">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </div>
        <div className="bg-card border border-foreground/10 p-4">
          <div className="text-2xl font-display text-yellow-500">{stats.todo}</div>
          <div className="text-sm text-muted-foreground">To Do</div>
        </div>
        <div className="bg-card border border-foreground/10 p-4">
          <div className="text-2xl font-display text-blue-500">{stats.inProgress}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="bg-card border border-foreground/10 p-4">
          <div className="text-2xl font-display text-[#eca8d6]">{stats.done}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-9 pr-4 bg-card border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
        </div>
        <div className="flex gap-2">
          {[
            { value: "all", label: "All" },
            { value: "todo", label: "To Do" },
            { value: "in-progress", label: "In Progress" },
            { value: "done", label: "Done" },
        ].map((status) => (<button key={status.value} onClick={() => setFilter(status.value)} className={`px-4 py-2 text-sm rounded-full transition-colors ${filter === status.value
                ? "bg-foreground text-background"
                : "bg-card border border-foreground/10 text-muted-foreground hover:text-foreground"}`}>
              {status.label}
            </button>))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {isLoading ? (<div className="p-8 text-center text-muted-foreground">Loading tasks...</div>) : paginatedTasks.map((task) => (<div key={task.id} className={`group bg-card border border-foreground/10 hover:border-foreground/20 transition-all p-4 flex items-start gap-4 ${task.status === "Done" ? "opacity-60" : ""}`}>
            <button onClick={() => toggleStatus(task.id)} className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === "Done"
                ? "bg-[#eca8d6] border-[#eca8d6]"
                : task.status === "In Progress"
                    ? "border-blue-500"
                    : "border-foreground/30 hover:border-foreground"}`}>
              {task.status === "Done" && <Check className="w-3 h-3 text-background"/>}
              {task.status === "In Progress" && <Circle className="w-2 h-2 fill-blue-500 text-blue-500"/>}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className={`font-medium ${task.status === "Done" ? "line-through" : ""}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <MoreHorizontal className="w-4 h-4"/>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/tasks/${task.id}`}>
                        <Pencil className="w-4 h-4 mr-2"/>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2"/>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3 h-3"/>
                  {task.dueDate}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <CheckSquare className="w-3 h-3"/>
                  {task.ceremony}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-mono ${task.priority === "High"
                ? "bg-destructive/10 text-destructive"
                : task.priority === "Medium"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-muted text-muted-foreground"}`}>
                  {task.priority}
                </span>
                <span className="text-muted-foreground">
                  Assigned to: {task.assignee}
                </span>
              </div>
            </div>
          </div>))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">Showing {Math.min(filteredTasks.length, (page-1)*PAGE_SIZE+1)}-{Math.min(filteredTasks.length, page*PAGE_SIZE)} of {filteredTasks.length}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p-1))} className="px-3 py-1 bg-card border rounded" disabled={page === 1}>Prev</button>
          <div className="text-sm">Page {page} of {pageCount}</div>
          <button onClick={() => setPage((p) => Math.min(pageCount, p+1))} className="px-3 py-1 bg-card border rounded" disabled={page === pageCount}>Next</button>
        </div>
      </div>

      {filteredTasks.length === 0 && (<div className="text-center py-12">
          <CheckSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4"/>
          <p className="text-muted-foreground">No tasks found</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/dashboard/tasks/new">Create your first task</Link>
          </Button>
        </div>)}
    </div>);
}
