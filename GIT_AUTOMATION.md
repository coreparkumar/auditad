# Git Automation Scripts

Automated scripts for committing and pushing changes to your Git remote (GitHub, GitLab, or any git provider).

## Available Scripts

### 1. Batch Script (Windows Command Prompt)
**File:** `commit-and-push.bat`

#### Usage
```bash
# With commit message as argument
commit-and-push.bat "Your commit message"

# Without argument (prompts for message)
commit-and-push.bat
```

#### Example
```bash
commit-and-push.bat "Add PWA splash screen enhancements"
```

---

### 2. PowerShell Script (Windows PowerShell/Core)
**File:** `commit-and-push.ps1`

#### Usage
```powershell
# With commit message
.\commit-and-push.ps1 -Message "Your commit message"

# Push to a specific remote
.\commit-and-push.ps1 -Message "Your message" -Remote "gitlab"

# Without parameters (prompts for message, uses default 'origin' remote)
.\commit-and-push.ps1
```

#### Example
```powershell
.\commit-and-push.ps1 -Message "Update splash screen and scan behavior"
.\commit-and-push.ps1 -Message "Fix critical bug" -Remote "gitlab"
```

---

## What These Scripts Do

1. **Stage All Changes** → `git add -A`
2. **Commit with Your Message** → `git commit -m "message"`
3. **Push to Remote** → `git push origin` (or specified remote)

All steps include error handling and progress feedback.

---

## Prerequisites

- Git must be installed and configured on your system
- Your remote must be configured (e.g., `origin` pointing to GitHub/GitLab)
- You must be inside the git repository directory

---

## Supported Remotes

- **GitHub** (default via `origin`)
- **GitLab** (if you add it as a remote named `gitlab`)
- **Any Git Provider** (specify the remote name)

### To add GitLab as a remote:
```bash
git remote add gitlab https://gitlab.com/your-username/your-repo.git
```

Then push to GitLab:
```powershell
.\commit-and-push.ps1 -Message "Your message" -Remote "gitlab"
```

---

## Notes

- **Batch script** is simpler but less flexible (interactive or command-line argument only)
- **PowerShell script** is more feature-rich (supports multiple remotes, color output, better error handling)
- Both scripts work with any Git remote, not just GitHub or GitLab
