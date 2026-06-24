@echo off
setlocal
:: Allow passing port as first argument, or use existing PORT env var, default 3000
if "%~1" NEQ "" (
	set PORT=%~1
)
if "%PORT%"=="" set PORT=3000
set HOSTNAME=127.0.0.1
start "Wildflower Demo" http://%HOSTNAME%:%PORT%/
node server.js
