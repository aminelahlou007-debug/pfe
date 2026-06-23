@echo off
setlocal
set PORT=3000
set HOSTNAME=127.0.0.1
start "Wildflower Demo" http://127.0.0.1:3000
node server.js
