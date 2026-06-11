@echo off
cd /d "%~dp0"
call npm run build
if errorlevel 1 (
  echo Build failed.
  exit /b 1
)

echo.
echo PWA build complete.
echo Output folder: dist
pause
