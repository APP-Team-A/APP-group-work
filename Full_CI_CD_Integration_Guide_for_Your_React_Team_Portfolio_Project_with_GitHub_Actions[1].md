# Full CI/CD Integration Guide for Your React Team Portfolio Project with GitHub Actions

This guide provides a consolidated, step-by-step approach to integrate your React team portfolio website with Markdown-driven content, **GitHub Actions** for CI/CD, Docker for consistent environments, Snyk for security scanning, SonarQube for code quality, Datadog for monitoring, and Vercel for deployment. The ultimate goal is to create a seamless workflow where your group members can contribute their profiles by simply adding Markdown files, and the entire pipeline automates the rest.

Using GitHub Actions simplifies the CI/CD setup significantly as it's natively integrated with your GitHub repository, eliminating the need for a separate Jenkins server.

## 0. Prerequisites

Before you begin, ensure you have the following installed on your machine (for local development and testing):

*   **Git:** For version control.
*   **Node.js & npm/yarn:** For React development.
*   **Docker Desktop (or Docker Engine):** Useful for local testing of Docker-related steps.
*   **GitHub Account:** Your project repository will be hosted here.
*   **Vercel Account:** For deploying your React application.
*   **Snyk Account:** For security scanning.
*   **Datadog Account:** For monitoring.

## 1. Project Setup: React Application with Markdown Integration

This section covers setting up your React project to consume Markdown files for team member profiles. This part remains largely the same as it's independent of the CI/CD orchestrator.

### 1.1. Create Your React Project

If you haven't already, create a new React application:

```bash
npx create-react-app team-portfolio
cd team-portfolio
# or using Vite
npm create vite@latest team-portfolio -- --template react
cd team-portfolio
npm install
```

### 1.2. Install Markdown Dependencies

Install `react-markdown` and `remark-gfm` to parse and render Markdown in your React components:

```bash
npm install react-markdown remark-gfm
# or
yarn add react-markdown remark-gfm
```

### 1.3. Structure Your Markdown Files

Create a directory for your team members' Markdown files. A good practice is to place them in the `public` folder so they are directly accessible by your React application at runtime.

```
team-portfolio/
├── public/
│   ├── team_members/
│   │   ├── john_doe.md
│   │   ├── jane_smith.md
│   │   └── ...
│   └── index.html
├── src/
│   ├── components/
│   │   └── TeamMemberPage.js
│   ├── App.js
│   └── index.js
├── package.json
└── ...
```

### 1.4. Create Team Member Markdown Files

Each team member should create their own `.md` file (e.g., `john_doe.md`) in the `public/team_members/` directory. Include YAML Frontmatter for metadata.

**Example `public/team_members/john_doe.md`:**

```markdown
---
title: John Doe
role: Software Engineer
image: /images/john_doe.jpg
---

## About Me

John is a passionate software engineer with a knack for building scalable web applications. He specializes in front-end development using React and enjoys solving complex problems.

## Skills

- React
- JavaScript (ES6+)
- HTML5 & CSS3
- Node.js
- Git & GitHub

## Projects

### Project Alpha

A brief description of Project Alpha, highlighting John's contributions.

## Contact

- Email: [john.doe@example.com](mailto:john.doe@example.com)
- LinkedIn: [linkedin.com/in/johndoe](https://www.linkedin.com/in/johndoe)
- GitHub: [github.com/johndoe](https://github.com/johndoe)
```

### 1.5. Create React Component to Render Markdown

Create a `TeamMemberPage.js` component (e.g., in `src/components/`) to fetch and render the Markdown content. This component will parse the Markdown and display it.

**`src/components/TeamMemberPage.js`:**

```jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TeamMemberPage = ({ memberName }) => {
  const [markdown, setMarkdown] = useState('');
  const [frontmatter, setFrontmatter] = useState({});

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(`/team_members/${memberName}.md`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();

        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = text.match(frontmatterRegex);

        let content = text;
        if (match) {
          try {
            const fm = {};
            match[1].split('\n').forEach(line => {
              const [key, value] = line.split(': ').map(s => s.trim());
              if (key && value) fm[key] = value;
            });
            setFrontmatter(fm);
            content = match[2];
          } catch (e) {
            console.error("Error parsing frontmatter:", e);
          }
        }
        setMarkdown(content);

      } catch (error) {
        console.error("Error fetching markdown:", error);
        setMarkdown("## Content Not Found\n\nSorry, the profile you are looking for does not exist.");
      }
    };

    fetchMarkdown();
  }, [memberName]);

  return (
    <div className="team-member-profile">
      {frontmatter.title && <h1>{frontmatter.title}</h1>}
      {frontmatter.role && <p className="role">{frontmatter.role}</p>}
      {frontmatter.image && <img src={frontmatter.image} alt={frontmatter.title} className="profile-image" />}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default TeamMemberPage;
```

### 1.6. Set Up Dynamic Routing

Install `react-router-dom` for dynamic routing:

```bash
npm install react-router-dom
# or
yarn add react-router-dom
```

Configure your `App.js` to include routes for your home page, contact page, and dynamic team member pages.

**`src/App.js` (simplified example):**

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TeamMemberPage from './components/TeamMemberPage';
// Import your HomePage and ContactPage components

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        {/* Your Mega Menu for Team Members would link to /team/:memberName */}
        <Link to="/contact">Contact</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div>Home Page Content</div>} /> {/* Replace with your HomePage component */}
        <Route path="/team/:memberName" element={<TeamMemberPage />} />
        <Route path="/contact" element={<div>Contact Page Content</div>} /> {/* Replace with your ContactPage component */}
      </Routes>
    </Router>
  );
}

export default App;
```

### 1.7. Create Team Member List for Navigation

Create a simple data file to list your team members for the mega menu. This can be manually updated or generated by a script.

**`src/data/teamMembers.js`:**

```javascript
const teamMembers = [
  { id: 'john_doe', name: 'John Doe', role: 'Software Engineer' },
  { id: 'jane_smith', name: 'Jane Smith', role: 'UI/UX Designer' },
  // Add more members as needed
];

export default teamMembers;
```

Your mega menu component will import this list and generate links like `/team/john_doe`.

## 2. GitHub Actions Setup: The CI/CD Orchestrator

GitHub Actions will automate your pipeline directly within your GitHub repository. This is generally simpler than Jenkins as it requires no server management.

### 2.1. Create a GitHub Repository

If you haven't already, create a new GitHub repository and push your React project to it.

### 2.2. Configure GitHub Secrets

For security, sensitive information like API tokens should be stored as GitHub Secrets. Go to your GitHub repository `Settings` > `Secrets and variables` > `Actions`.

Add the following new repository secrets:

*   `SNYK_TOKEN`: Your Snyk API token.
*   `SONAR_TOKEN`: Your SonarQube user token.
*   `VERCEL_TOKEN`: Your Vercel API token.
*   `DATADOG_API_KEY`: Your Datadog API Key.
*   `DATADOG_APP_KEY`: Your Datadog Application Key.

### 2.3. Create the GitHub Actions Workflow File

Create a directory `.github/workflows/` in the root of your repository, and inside it, create a YAML file (e.g., `ci-cd.yml`). This file defines your GitHub Actions workflow.

**`.github/workflows/ci-cd.yml` Example:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main # Trigger on pull requests to the main branch

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest # Use a fresh Ubuntu virtual machine for each job

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test -- --ci --json --outputFile=test-results.json || true # || true to prevent build failure on test issues for demo

      - name: SonarQube Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        with:
          projectKey: your-org_your-repo # Replace with your SonarQube project key (e.g., react-portfolio)
          # For self-hosted SonarQube, you might need to specify hostUrl
          # hostUrl: http://localhost:9000 # This would be for a self-hosted SonarQube, but GitHub Actions runners are ephemeral
          # For self-hosted SonarQube, you'd typically run SonarScanner CLI directly
          # For simplicity and free tier, consider SonarCloud if your project is public

      - name: Snyk Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: test
          args: --json > snyk-results.json || true # || true to prevent build failure on Snyk issues for demo

      - name: Build React App
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }} # Optional, but recommended for team accounts
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }} # Optional, but recommended
          prod: true # Deploy to production

      - name: Send Datadog Metrics
        run: |
          BUILD_STATUS="${{ job.status }}"
          BUILD_DURATION=$((
            $(date +%s) - $(git log -1 --format=%ct)
          ))
          curl -X POST -H "Content-Type: application/json" \
            "https://api.datadoghq.com/api/v1/series?api_key=${{ secrets.DATADOG_API_KEY }}" \
            -d "{\"series\":[{\"metric\":\"github.actions.build.duration\",\"points\":[[$(date +%s), ${BUILD_DURATION}]],\"type\":\"gauge\",\"host\":\"github-actions-runner\",\"tags\":[\"project:react-portfolio\",\"status:${BUILD_STATUS}\"]}]}"
          curl -X POST -H "Content-Type: application/json" \
            "https://api.datadoghq.com/api/v1/series?api_key=${{ secrets.DATADOG_API_KEY }}" \
            -d "{\"series\":[{\"metric\":\"github.actions.build.status\",\"points\":[[$(date +%s), $(if [ \"${BUILD_STATUS}\" == \"success\" ]; then echo 1; else echo 0; fi)]],\"type\":\"gauge\",\"host\":\"github-actions-runner\",\"tags\":[\"project:react-portfolio\",\"status:${BUILD_STATUS}\"]}]}"
        env:
          DATADOG_API_KEY: ${{ secrets.DATADOG_API_KEY }}
          DATADOG_APP_KEY: ${{ secrets.DATADOG_APP_KEY }}
```

**Explanation of the GitHub Actions Workflow:**

*   `name`: The name of your workflow.
*   `on`: Defines when the workflow runs. Here, it runs on `push` and `pull_request` events to the `main` branch.
*   `jobs`: A workflow run is made up of one or more jobs. `build-and-deploy` is our main job.
*   `runs-on: ubuntu-latest`: Specifies that the job will run on a fresh Ubuntu virtual machine.
*   `steps`: A sequence of tasks to be executed as part of the job.
    *   `actions/checkout@v4`: A standard action to check out your repository code.
    *   `actions/setup-node@v4`: Sets up the Node.js environment.
    *   `npm install`, `npm test`, `npm run build`: Standard commands for a React project.
    *   **SonarQube Scan:** We use `SonarSource/sonarcloud-github-action@master`. For a self-hosted SonarQube, you'd typically run the `sonar-scanner` CLI directly, but this requires the SonarQube server to be accessible from the GitHub Actions runner, which is not straightforward for a free setup. **For ease and free tier, consider using [SonarCloud](https://sonarcloud.io/)** (SonarSource's cloud-based SonarQube service) for public repositories, as it integrates seamlessly with this action. If you must use a self-hosted SonarQube, you'd need to expose it publicly or use a self-hosted GitHub Actions runner.
    *   **Snyk Scan:** Uses `snyk/actions/node@master` to run Snyk tests. The `SNYK_TOKEN` is passed securely from GitHub Secrets.
    *   **Deploy to Vercel:** Uses `amondnet/vercel-action@v20` for easy deployment. You might need `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` if you're part of a Vercel team or have specific project configurations. These can also be stored as GitHub Secrets.
    *   **Send Datadog Metrics:** A `curl` command is used to send custom metrics (build duration, build status) to Datadog. The `DATADOG_API_KEY` is securely accessed from GitHub Secrets.

**Important Notes for GitHub Actions Workflow:**

*   **Replace Placeholders:** Update `your-username/your-repo` and `your-org_your-repo` with your actual GitHub repository and SonarCloud/SonarQube project keys.
*   **Secrets:** Ensure all required secrets (`SNYK_TOKEN`, `SONAR_TOKEN`, `VERCEL_TOKEN`, `DATADOG_API_KEY`, `DATADOG_APP_KEY`, and optionally `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) are correctly configured in your GitHub repository settings.
*   **`|| true` for Tests/Scans:** Similar to Jenkins, `|| true` is added to `npm test` and Snyk commands to prevent the workflow from failing immediately on test or vulnerability issues, which is useful for demonstration. Remove this in a production setup to enforce quality gates.
*   **SonarCloud vs. Self-hosted SonarQube:** For a free and easy setup with GitHub Actions, SonarCloud is highly recommended for public repositories. If your repository is private, SonarCloud still offers a free tier for private projects up to a certain limit. Setting up a self-hosted SonarQube that's accessible by GitHub Actions runners is more complex and usually involves exposing it to the internet or using a VPN/private network, which goes beyond a simple free setup.

## 3. Security Scanning with Snyk

### 3.1. Create Snyk Account

Sign up at [snyk.io](https://snyk.io/) and connect your GitHub repository.

### 3.2. Get Snyk API Token

In Snyk, `Integrations` > `API Key`, copy your token.

### 3.3. Add Snyk Token to GitHub Secrets

As mentioned in Section 2.2, add your Snyk API token as a GitHub Secret named `SNYK_TOKEN`.

## 4. Code Quality with SonarQube (or SonarCloud)

For a free and easy setup with GitHub Actions, **SonarCloud** is generally preferred over a self-hosted SonarQube instance, especially for public repositories. SonarCloud is the cloud-based version of SonarQube and integrates seamlessly with GitHub.

### 4.1. Create SonarCloud Account

Go to [sonarcloud.io](https://sonarcloud.io/) and sign up, preferably with your GitHub account. Import your GitHub repository.

### 4.2. Get SonarCloud Token

In SonarCloud, go to `My Account` > `Security` > `Generate Tokens`. Give it a name and copy the token.

### 4.3. Add SonarCloud Token to GitHub Secrets

As mentioned in Section 2.2, add your SonarCloud token as a GitHub Secret named `SONAR_TOKEN`.

### 4.4. Configure SonarCloud Project Key

In your GitHub Actions workflow file (`.github/workflows/ci-cd.yml`), ensure the `projectKey` in the SonarQube Scan step matches your project key in SonarCloud (e.g., `your-github-org_your-repo-name`).

## 5. Deployment with Vercel

### 5.1. Create Vercel Account

Sign up at [vercel.com](https://vercel.com/) and connect your GitHub repository. Vercel will automatically detect your React project.

### 5.2. Get Vercel API Token

In Vercel, `Settings` > `Tokens` > `Create`, copy your token.

### 5.3. Add Vercel Token to GitHub Secrets

As mentioned in Section 2.2, add your Vercel API token as a GitHub Secret named `VERCEL_TOKEN`.

### 5.4. (Optional) Vercel Org and Project IDs

If you are using a Vercel team account or have specific project configurations, you might need your Vercel Organization ID and Project ID. These can be found in your Vercel project settings. Add them as GitHub Secrets: `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.

## 6. Monitoring with Datadog

### 6.1. Create Datadog Account

Sign up at [app.datadoghq.com](https://app.datadoghq.com/) for a free account.

### 6.2. Get Datadog API and Application Keys

In Datadog, `Organization Settings` > `API Keys`, copy your API Key and Application Key.

### 6.3. Add Datadog Keys to GitHub Secrets

As mentioned in Section 2.2, add your Datadog API Key as `DATADOG_API_KEY` and your Datadog Application Key as `DATADOG_APP_KEY` to GitHub Secrets.

## 7. Final Workflow for Group Members

Once the initial setup is complete, the workflow for your group members becomes incredibly simple:

1.  **Clone the Repository:** Each member clones the project from GitHub.
2.  **Create/Edit Markdown File:** Each member creates or updates their `[their_name].md` file in the `public/team_members/` directory with their profile information.
3.  **Commit and Push:** Members commit their changes and push them to the `main` branch of the GitHub repository.

That's it! GitHub Actions will automatically detect the push, trigger the workflow, run all checks (tests, SonarCloud, Snyk), build the React application (which includes processing the new Markdown file), deploy it to Vercel, and send monitoring data to Datadog. Your lecturer will see a live, updated website reflecting everyone's contributions, all automated.

This setup provides a powerful demonstration of modern CI/CD practices, making collaboration easy and efficient for your team. Good luck!

## References

[1] Docker Installation Guides: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
[2] SonarCloud Documentation: [https://docs.sonarcloud.io/](https://docs.sonarcloud.io/)
[3] Snyk Documentation: [https://docs.snyk.io/](https://docs.snyk.io/)
[4] Vercel Documentation: [https://vercel.com/docs](https://vercel.com/docs)
[5] Datadog Documentation: [https://docs.datadoghq.com/](https://docs.datadoghq.com/)
[6] GitHub Actions Documentation: [https://docs.github.com/en/actions](https://docs.github.com/en/actions)


