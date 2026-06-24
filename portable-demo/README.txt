Wildflower Portable Demo

Quick start
1. If `node_modules` is missing, run `npm ci` in this folder.
2. Double-click "Start Wildflower Demo.bat" (or run it from PowerShell/CMD).
3. Your browser opens to http://localhost:3000 (or the port you specify).

Notes
- Keep this folder on the USB drive.
- To run on a different port, pass the port number as the first argument to the batch file, e.g. `Start Wildflower Demo.bat 4000`, or set the `PORT` environment variable before launching.

Requirements
- Windows
- Node.js 18+ (recommended)

Behaviour
This demo runs the built Next.js standalone server bundled in this folder. If MongoDB or OpenAI are not available the app falls back to built-in demo data so the site remains functional offline.

Troubleshooting
- If the browser does not open automatically, navigate to http://localhost:3000 (or the port you set).
- If you see errors about missing modules, run `npm ci` to restore `node_modules`.
- For advanced troubleshooting, run `node server.js` from a terminal to view server logs.
