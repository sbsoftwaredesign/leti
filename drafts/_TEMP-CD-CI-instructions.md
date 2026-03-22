

Let me gather the existing CI/CD setup from this project to base the instructions on.  

Read [](file:///Users/sebastianbourges/WebDev/Personal/Project-Borges/setup-server.sh)

Read [](file:///Users/sebastianbourges/WebDev/Personal/Project-Borges/.woodpecker.yml)

Here are the instructions for deploying a new Astro project to your miniweb-vm via Woodpecker CI:

---

## CI/CD Deployment to miniweb-vm (Astro Static Site)

### Prerequisites

- **Woodpecker CI** running at `http://192.168.10.110:8000`
- **Gitea** at `192.168.10.110:2222` (Woodpecker source)
- **miniweb-vm** at `192.168.50.21` with Nginx, Node 24 via nvm, pnpm via corepack
- RSA deploy key (PEM format) stored as a Woodpecker secret

### Step 1: Choose a port and project name

Pick a unique port number not already in use on miniweb-vm. Existing allocations:
- `8082` — borges-ebook

Example: project name `my-project`, port `8083`.

### Step 2: Create the Gitea repository

Push your Astro project to Gitea:

```bash
git remote add gardel ssh://git@192.168.10.110:2222/sebastian/my-project.git
git push gardel main
```

Then enable the repo in Woodpecker CI (`http://192.168.10.110:8000` → Add repository).

### Step 3: Add the deploy key secret

In Woodpecker, go to the repo settings → Secrets → Add `DEPLOY_KEY` with the RSA PEM private key that has SSH access to `sebastian@192.168.50.21`.

### Step 4: Create the Nginx config on miniweb-vm

SSH into miniweb-vm and create the site config:

```bash
ssh miniweb-vm
```

```bash
# Replace MY_PROJECT and PORT with your values
PROJECT_NAME="my-project"
PORT=8083
DEPLOY_DIR="/home/sebastian/${PROJECT_NAME}"

sudo tee /etc/nginx/sites-available/${PROJECT_NAME} > /dev/null << EOF
server {
    listen ${PORT};
    listen [::]:${PORT};
    server_name _;

    root ${DEPLOY_DIR}/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
EOF

sudo ln -sf /etc/nginx/sites-available/${PROJECT_NAME} /etc/nginx/sites-enabled/${PROJECT_NAME}
sudo nginx -t && sudo systemctl reload nginx
sudo ufw allow ${PORT}/tcp
```

### Step 5: Create .woodpecker.yml in the project root

Adapt these values:
- `DEPLOY_DIR` — the directory on miniweb-vm (e.g. `/home/sebastian/my-project`)
- `source` — the folder containing your Astro project (use `./*` if at root, or `subfolder/*` if nested)
- `strip_components` — set to `1` if source is a subfolder (strips the folder prefix), `0` if at root

```yaml
when:
  - event: push
    branch: main

steps:
  # Clean stale source files on miniweb-vm before deploying
  clean-source:
    image: appleboy/drone-ssh
    settings:
      host: 192.168.50.21
      username: sebastian
      key:
        from_secret: DEPLOY_KEY
      command_timeout: 1m
      script:
        - rm -rf /home/sebastian/my-project/src
        - rm -rf /home/sebastian/my-project/public

  # Copy source files to miniweb-vm
  deploy-source:
    image: appleboy/drone-scp
    settings:
      host: 192.168.50.21
      username: sebastian
      target: /home/sebastian/my-project
      source:
        - ./*
      strip_components: 0
      key:
        from_secret: DEPLOY_KEY

  # Build, test, and serve on miniweb-vm
  build-and-deploy:
    image: appleboy/drone-ssh
    settings:
      host: 192.168.50.21
      username: sebastian
      key:
        from_secret: DEPLOY_KEY
      command_timeout: 5m
      script:
        - cd /home/sebastian/my-project
        - export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
        - nvm use 24
        - corepack enable
        - pnpm install
        - rm -rf dist
        - pnpm build
        - pnpm test
        - echo "Deploy complete — http://192.168.50.21:8083"
```

### Step 6: Push and verify

```bash
git add .woodpecker.yml
git commit -m "ci: add Woodpecker CI pipeline"
git push gardel main
```

Monitor the build at `http://192.168.10.110:8000`. Once green, your site is live at `http://192.168.50.21:{PORT}`.

### Key details

| Component | Value |
|---|---|
| CI server | Woodpecker at `http://192.168.10.110:8000` |
| Git host | Gitea at `ssh://git@192.168.10.110:2222` |
| Deploy target | `sebastian@192.168.50.21` |
| Build steps | `pnpm install` → `pnpm build` → `pnpm test` |
| Output | Astro static files in `dist/` served by Nginx |
| Trigger | Push to `main` branch |
| Images used | `appleboy/drone-ssh` (remote commands), `appleboy/drone-scp` (file copy) |

### Notes

- The pipeline runs **on miniweb-vm itself** — Woodpecker SSHs in and builds there (no Docker-based build step). This means Node/pnpm must be installed on miniweb-vm.
- If your project has no tests, remove the `pnpm test` line from the build step.
- If your Astro project is inside a subfolder (like ebook in this project), set `source: subfolder/*` and `strip_components: 1`, and adjust the clean step paths accordingly.
- The `clean-source` step prevents stale files from prior builds. Add any additional source directories your project uses (e.g. `scripts/`, `components/`).