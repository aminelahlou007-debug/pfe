"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { readJsonResponse } from "@/lib/safe-json";
export default function EditTaskPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [form, setForm] = useState({
        title: "",
        description: "",
        ceremony: "",
        assignee: "",
        priority: "Medium",
        status: "Pending",
        dueDate: "",
        category: "",
    });
    useEffect(() => {
        if (!id)
            return;
        const loadTask = async () => {
            const response = await fetch(`/api/tasks/${id}`);
            if (response.ok) {
                const task = await readJsonResponse(response);
                if (!task) {
                    setIsFetching(false);
                    return;
                }
                setForm(task);
            }
            setIsFetching(false);
        };
        loadTask();
    }, [id]);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await fetch(`/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setIsLoading(false);
        router.push("/dashboard/tasks");
    };
    return (<div className="space-y-6">
      {isFetching ? <div className="text-muted-foreground">Loading task...</div> : null}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tasks">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5"/>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Task</h1>
          <p className="text-muted-foreground">Edit task details for your event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Task Title</Label>
              <Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Enter task title" className="border-white/10 bg-white/5" required/>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Enter task description" className="min-h-[100px] border-white/10 bg-white/5"/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ceremony">Event</Label>
              <Select value={form.ceremony} onValueChange={(value) => setForm({ ...form, ceremony: value })}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue placeholder="Select event"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Johnson Wedding">Johnson Wedding</SelectItem>
                  <SelectItem value="Smith Anniversary">Smith Anniversary</SelectItem>
                  <SelectItem value="Tech Corp Gala">Tech Corp Gala</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select value={form.assignee} onValueChange={(value) => setForm({ ...form, assignee: value })}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue placeholder="Select assignee"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="You">Myself</SelectItem>
                  <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={form.priority} onValueChange={(value) => setForm({ ...form, priority: value })}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue placeholder="Select priority"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue placeholder="Select status"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todo">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="border-white/10 bg-white/5" required/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue placeholder="Select category"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Venue">Venue</SelectItem>
                  <SelectItem value="Catering">Catering</SelectItem>
                  <SelectItem value="Decoration">Decoration</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/dashboard/tasks">
            <Button variant="outline" className="border-white/10">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="bg-emerald-500 text-black hover:bg-emerald-400">
            {isLoading ? ("Saving...") : (<>
                <Save className="mr-2 h-4 w-4"/>
                Save Task
              </>)}
          </Button>
        </div>
      </form>
    </div>);
}
