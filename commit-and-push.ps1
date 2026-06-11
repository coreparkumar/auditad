#!/usr/bin/env pwsh
<#
.SYNOPSIS
    PowerShell script to commit and push changes to Git remote (GitHub/GitLab)

.DESCRIPTION
    Automates the process of staging, committing, and pushing changes to your configured Git remote.

.PARAMETER Message
    The commit message. If not provided, you'll be prompted to enter one.

.PARAMETER Remote
    The remote name to push to (default: origin)

.EXAMPLE
    .\commit-and-push.ps1 -Message "Add new features"
    .\commit-and-push.ps1 -Message "Fix bug" -Remote "gitlab"

.NOTES
    Works with GitHub, GitLab, and any Git remote.
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$Message,
    
    [Parameter(Mandatory = $false)]
    [string]$Remote = "origin"
)

# Header
Write-Host ""
Write-Host "========================================"
Write-Host "   Git Commit and Push Automation" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# Get commit message if not provided
if ([string]::IsNullOrEmpty($Message)) {
    $Message = Read-Host "Enter commit message"
    
    if ([string]::IsNullOrEmpty($Message)) {
        Write-Host "Error: Commit message cannot be empty." -ForegroundColor Red
        exit 1
    }
}

# Step 1: Stage changes
Write-Host "Staging all changes..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to stage changes." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Changes staged." -ForegroundColor Green

# Step 2: Commit
Write-Host ""
Write-Host "Committing changes with message: `"$Message`"" -ForegroundColor Yellow
git commit -m "$Message"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Commit failed. Check if there are changes to commit." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Changes committed." -ForegroundColor Green

# Step 3: Push
Write-Host ""
Write-Host "Pushing to remote '$Remote'..." -ForegroundColor Yellow
git push $Remote
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Push failed. Check your remote configuration." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Changes pushed successfully!" -ForegroundColor Green

# Footer
Write-Host ""
Write-Host "========================================"
Write-Host "   Commit and push completed!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
