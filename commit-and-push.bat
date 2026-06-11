@echo off
REM Batch script to commit and push changes to Git remote (GitHub/GitLab)
REM Usage: commit-and-push.bat "Your commit message"

setlocal enabledelayedexpansion

REM Get commit message from argument or prompt user
if "%~1"=="" (
    echo.
    echo ========================================
    echo   Git Commit and Push Automation
    echo ========================================
    echo.
    set /p commit_msg="Enter commit message: "
    if "!commit_msg!"=="" (
        echo Error: Commit message cannot be empty.
        exit /b 1
    )
) else (
    set "commit_msg=%~1"
)

echo.
echo Staging all changes...
git add -A
if %errorlevel% neq 0 (
    echo Error: Failed to stage changes.
    exit /b 1
)
echo ✓ Changes staged.

echo.
echo Committing changes with message: "%commit_msg%"
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo Error: Commit failed. Check if there are changes to commit.
    exit /b 1
)
echo ✓ Changes committed.

echo.
echo Pushing to remote...
git push
if %errorlevel% neq 0 (
    echo Error: Push failed. Check your remote configuration.
    exit /b 1
)
echo ✓ Changes pushed successfully!

echo.
echo ========================================
echo   Commit and push completed!
echo ========================================
echo.
