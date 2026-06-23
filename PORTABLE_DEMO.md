# Portable Demo

This project can be packaged into a USB-friendly demo folder for Windows.

What you get:
- A standalone Next.js build
- A one-click launcher: `Start Wildflower Demo.bat`
- Built-in fallback data if MongoDB or OpenAI are unavailable

How to prepare the demo:

```powershell
pnpm build
pnpm portable:build
```

Copy the generated `portable-demo` folder to your USB drive.

Important:
- The target PC still needs Node.js installed.
- If you want a true no-install EXE, the next step is to wrap this in Electron or Tauri.