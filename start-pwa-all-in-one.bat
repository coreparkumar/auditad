@echo off
cd /d "%~dp0"

echo ==========================================
echo AuditAd PWA Launcher
echo ==========================================
echo.
echo 1) Build PWA
call npm run build
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)

echo.
echo 2) Start local PWA dev server
start "AuditAd PWA Dev" cmd /k npm run dev

echo.
echo 3) Package production build
if not exist "package" mkdir package
powershell -NoProfile -Command "Compress-Archive -Path dist\* -DestinationPath package\auditad-pwa.zip -Force"

echo.
echo Done.
echo Dev server launched in a new window.
echo Package created: package\auditad-pwa.zip
pause
