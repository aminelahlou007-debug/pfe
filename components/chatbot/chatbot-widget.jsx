"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageSquare, Send, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
const starterMessages = [
    {
        role: "assistant",
        content: "Hi — I can help with the site, ceremonies, venues, flowers, food, vendors, and planning tasks.",
        createdAt: new Date().toISOString(),
    },
];
const STORAGE_KEY = "wildflower_chat_messages_v1";
const MAX_CLIENT_MESSAGES = 30;
export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(starterMessages);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (!isOpen)
            return;
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const cleaned = parsed
                    .filter((message) => message && typeof message.content === "string")
                    .slice(-MAX_CLIENT_MESSAGES);
                setMessages(cleaned.length ? cleaned : starterMessages);
            }
        }
        catch {
        }
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
        catch {
        }
    }, [messages]);
    const canSend = input.trim().length > 0 && !isSending;
    const appendAssistantMessage = useCallback((content) => {
        setMessages((current) => [
            ...current,
            { role: "assistant", content, createdAt: new Date().toISOString() },
        ]);
    }, []);
    const submitPrompt = useCallback(async () => {
        const prompt = input.trim();
        if (!prompt || isSending)
            return;
        const nextMessages = [
            ...messages,
            { role: "user", content: prompt, createdAt: new Date().toISOString() },
        ].slice(-MAX_CLIENT_MESSAGES);
        setMessages(nextMessages);
        setInput("");
        setIsSending(true);
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: nextMessages }),
            });
            if (!response.ok) {
                appendAssistantMessage("The assistant is temporarily unavailable. Please try again.");
                return;
            }
            const data = (await response.json());
            const answer = data.answer?.trim() || "I could not generate an answer just now.";
            appendAssistantMessage(answer);
        }
        catch {
            appendAssistantMessage("The chat service is unavailable right now. Try again in a moment.");
        }
        finally {
            setIsSending(false);
        }
    }, [appendAssistantMessage, input, isSending, messages]);
    const sendMessage = useCallback(async (event) => {
        event.preventDefault();
        await submitPrompt();
    }, [submitPrompt]);
    function clearChat() {
        setMessages(starterMessages);
        try {
            localStorage.removeItem(STORAGE_KEY);
        }
        catch {
        }
    }
    function formatTime(iso) {
        if (!iso)
            return "";
        try {
            const d = new Date(iso);
            return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        catch {
            return "";
        }
    }
    return (<div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
      {isOpen ? (<aside className="transform transition-all duration-300 ease-in-out will-change-transform">
          <Card className="w-[min(92vw,24rem)] overflow-hidden border-foreground/10 bg-background/95 shadow-2xl backdrop-blur-xl sm:w-[28rem]">
            <CardHeader className="px-4 py-3 bg-gradient-to-r from-foreground/90 via-[#c77aa0]/80 to-foreground/60 text-background">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-3 text-base font-display">
                    <div className="rounded-full bg-white/10 p-1">
                      <Bot className="h-4 w-4 text-white"/>
                    </div>
                    Wildflower Assistant
                  </CardTitle>
                  <p className="mt-1 text-sm text-white/90">Quick answers about events, vendors, and planning.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full text-white/90" onClick={() => clearChat()} aria-label="Clear chat">
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full text-white/90" onClick={() => setIsOpen(false)} aria-label="Close chatbot">
                    <X className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="max-h-[26rem] space-y-4 overflow-y-auto px-4 py-4">
                {messages.map((message, index) => (<div key={`${message.role}-${index}`} className={cn("flex w-full items-end", message.role === "user" ? "justify-end" : "justify-start")}>
                    {message.role === "assistant" ? (<div className="mr-3 flex flex-col items-start">
                        <div className="rounded-full bg-foreground/[0.06] p-2 text-foreground">
                          <Bot className="h-4 w-4"/>
                        </div>
                      </div>) : null}

                    <div className={cn("max-w-[84%] rounded-2xl px-3 py-2 text-sm leading-6", message.role === "user" ? "bg-foreground text-background" : "border border-foreground/10 bg-gradient-to-b from-background via-background/60 to-transparent text-foreground")}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="mt-2 text-xs text-muted-foreground/70 text-right">{formatTime(message.createdAt)}</div>
                    </div>

                    {message.role === "user" ? (<div className="ml-3 flex flex-col items-end">
                        <div className="rounded-full bg-foreground p-2 text-background">You</div>
                      </div>) : null}
                  </div>))}

                {isSending ? (<div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin"/>
                      Thinking
                    </div>
                  </div>) : null}
                <div ref={messagesEndRef}/>
              </div>

              <form onSubmit={sendMessage} className="border-t border-foreground/10 p-3 bg-background/80">
                <div className="flex items-end gap-2">
                  <Textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (canSend) {
                        void submitPrompt();
                    }
                }
            }} placeholder="Ask about flowers, food, venues, tasks..." className="min-h-12 resize-none rounded-2xl border-foreground/10 bg-background/80 text-sm" rows={2}/>
                  <Button type="submit" size="icon" className="h-11 w-11 rounded-2xl bg-foreground text-background hover:bg-foreground/90" disabled={!canSend} aria-label="Send message">
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </aside>) : (<div className="flex items-center gap-3">
          <Button type="button" onClick={() => setIsOpen(true)} className="flex items-center gap-3 rounded-full bg-gradient-to-r from-foreground to-[#c77aa0] px-4 py-3 text-background shadow-2xl shadow-foreground/30 hover:scale-105 transform transition-transform">
            <MessageSquare className="h-4 w-4"/>
            Ask the assistant
          </Button>
        </div>)}
    </div>);
}
