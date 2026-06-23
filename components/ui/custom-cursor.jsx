"use client";
import { useState, useEffect } from 'react';
const colors = ['red', 'green', 'blue'];
const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [colorIndex, setColorIndex] = useState(0);
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const touchDetected = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
        if (touchDetected) {
            setIsTouch(true);
            return; // do not attach listeners on touch devices
        }
        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', onMouseMove);
        const colorInterval = setInterval(() => {
            setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
        }, 500);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            clearInterval(colorInterval);
        };
    }, []);
    if (isTouch)
        return null;
    return (<div className="fixed pointer-events-none z-50" style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: `3px solid ${colors[colorIndex]}`,
            background: 'transparent',
            transform: 'translate(-50%, -50%)',
            transition: 'border-color 0.5s ease-in-out, transform 0.08s linear',
            boxSizing: 'border-box',
        }}/>);
};
export default CustomCursor;
