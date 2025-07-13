# APP Group Work Project

Welcome to our collaborative project! This guide is for team members new to Git and using Ubuntu WSL (Windows Subsystem for Linux). Follow these steps to set up the project, work on your own branch, and collaborate effectively. **We aim for a minimum of 100 commits in this project, so commit regularly to track your progress.**

## Prerequisites
Before starting, ensure you have set up your Ubuntu WSL environment and installed necessary tools (e.g., Git, Node.js, npm) by following the instructions in [this Medium article](https://medium.com/@sjmwatsefu/how-to-install-wsl-2-ubuntu-20-04-lts-on-windows-and-open-visual-studio-code-from-the-terminal-e580761e84f8).

**Confirmation**: Have you completed the setup steps in the article? If not, please follow the article first, then return here. If you’re ready, proceed below.

## Step-by-Step Guide

### 1. Create a Folder in Ubuntu WSL
To keep your project organized, create a dedicated folder for the project:

1. Open your Ubuntu WSL terminal.
2. Create a folder (e.g., `school`) maybe for your school work:
   ```bash
   mkdir school
   ```
3. Navigate into the folder:
   ```bash
   cd school
   ```

### 2. Clone the Repository
Clone the project repository into the folder you just created:

1. Run the following command to clone the repository:
   ```bash
   git clone git@github.com:Salimmwatsefu/APP-group-work.git
   ```
2. Move into the project directory:
   ```bash
   cd APP-group-work
   ```

### 3. Verify You’re on the Main Branch
After cloning, you’ll be on the `main` branch by default. Confirm this by running:
```bash
git branch
```
You should see `* main` as the active branch. If not, switch to `main`:
```bash
git checkout main
```

### 4. Install Project Dependencies
Install the project dependencies to set up the Vite app:

1. Run the following command:
   ```bash
   npm install
   ```
2. Verify the setup by starting the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in a browser to confirm the app runs (you may need to open the port in Windows, as described in the Medium article).

### 5. Review Tasks and Roles
**Before creating your branch or making changes**, the team will assign and discuss everyone’s tasks and roles. This will be documented in a team meeting or shared via our group chat. Ensure you understand your specific task (e.g., building a specific feature or fixing a bug) before proceeding. If you’re unsure about your role, check with the project lead.

### 6. Create Your Own Branch
Once your task is assigned, create a branch to work on your changes:

1. Create a new branch with a descriptive name related to your task (e.g., `yourname-feature`):
   ```bash
   git checkout -b yourname-feature
   ```
   Replace `yourname-feature` with something like `alice-login-page` or `bob-bugfix`.
2. Verify you’re on your new branch:
   ```bash
   git branch
   ```
   You should see `* yourname-feature` as the active branch.

### 7. Pull Changes from the Main Branch
To stay up-to-date with the `main` branch:

1. Ensure you’re on your branch:
   ```bash
   git checkout yourname-feature
   ```
2. Pull the latest changes from the `main` branch:
   ```bash
   git pull origin main
   ```

### 8. Work on Your Changes
- Make changes to the project files (e.g., edit code in the `src/` folder) based on your assigned task.
- Test your changes locally:
  ```bash
  npm run dev
  ```

### 9. Commit and Push to Your Branch
After making changes:

1. Stage your changes:
   ```bash
   git add .
   ```
2. Commit your changes with a clear message describing your work:
   ```bash
   git commit -m "Describe your changes here"
   ```
   Example: `git commit -m "Add login page UI"`
3. **Commit regularly**: To meet our goal of at least 100 commits, make small, frequent commits for each meaningful change (e.g., after completing a component, fixing a bug, or updating a file).
4. Push your branch to GitHub:
   ```bash
   git push -u origin yourname-feature
   ```

### 10. Create a Pull Request
To merge your changes into the `main` branch:

1. Go to the GitHub repository: [github.com/Salimmwatsefu/APP-group-work](https://github.com/Salimmwatsefu/APP-group-work).
2. Click the "Pull requests" tab, then "New pull request."
3. Select your branch (`yourname-feature`) as the source and `main` as the target.
4. Add a description of your changes and submit the pull request.
5. Notify the team (e.g., via group chat) to review your pull request.

### Important Notes
- **Commit regularly**: We need a minimum of 100 commits across the project, so commit small changes often with clear messages.
- **Always work on your own branch**, not `main`, to avoid conflicts.
- **Pull frequently** from `main` to stay updated:
  ```bash
  git pull origin main
  ```
- **Don’t push to `main` directly**. Use pull requests for collaboration.
- If you encounter errors:
  - Check your branch: `git branch`
  - Verify the remote: `git remote -v`
  - Ensure you’ve committed changes: `git status`
  - Ask for help in the team chat or consult the project lead.

### Common Commands Recap
- Create a folder: `mkdir app-group-work`
- Clone: `git clone git@github.com:Salimmwatsefu/APP-group-work.git`
- Verify main branch: `git checkout main`
- Install dependencies: `npm install`
- Create branch: `git checkout -b yourname-feature`
- Pull updates: `git pull origin main`
- Stage changes: `git add .`
- Commit: `git commit -m "Your message"`
- Push: `git push -u origin yourname-feature`

Happy coding, and let’s build something awesome together!