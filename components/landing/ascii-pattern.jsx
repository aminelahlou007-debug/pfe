"use client";
import { useEffect, useState } from "react";
export function AsciiPattern() {
    const [pattern, setPattern] = useState("");
    useEffect(() => {
        const generatePattern = () => {
            return Array.from({ length: 60 }, () => Array.from({ length: 100 }, () => Math.random() > 0.7 ? '"' : " ").join("")).join("\n");
        };
        setPattern(generatePattern());
    }, []);
    return (<div className="absolute inset-0 font-mono text-[10px] text-background/[0.02] leading-tight overflow-hidden whitespace-pre select-none">
      {pattern}
    </div>);
}
