@echo off
cd /d "%~dp0"
call npm run build
if errorlevel 1 (
  echo Build failed.
  exit /b 1
)

echo.
echo Creating package archive from dist...
if not exist "package" mkdir package
powershell -NoProfile -Command "Compress-Archive -Path dist\* -DestinationPath package\auditad-pwa.zip -Force"

echo.
echo Package created: package\auditad-pwa.zip
pause
