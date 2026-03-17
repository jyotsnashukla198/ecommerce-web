#!/bin/bash
set -e
exec > /var/log/userdata.log 2>&1

# ── 1. System update & Git ────────────────────────────────────────────────────
dnf update -y
dnf install -y git

# ── 2. NVM + Node (as ec2-user) ───────────────────────────────────────────────
su - ec2-user -c '
  set -e

  # Install nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

  # Load nvm
  export NVM_DIR="$HOME/.nvm"
  source "$NVM_DIR/nvm.sh"

  # Install latest LTS Node
  nvm install --lts
  nvm use --lts
  nvm alias default node

  # ── 3. Clone repo ─────────────────────────────────────────────────────────
  cd ~
  git clone https://github.com/jyotsnashukla198/ecommerce-web.git
  cd ecommerce-web

  # ── 4. Environment file ───────────────────────────────────────────────────
  cat > .env.local <<EOF
DATABASE_URL=postgresql://postgres:password@database-1.cluster-cj84u08a0h8y.ap-south-1.rds.amazonaws.com:5432/postgres
JWT_SECRET=fdcb2adcf27af609b5aaf4331e946a53ef08e526bd7d45890c41d565ae680428
NODE_ENV=production
EOF

  # ── 5. Install deps & build ───────────────────────────────────────────────
  npm install
  npm run build
'

# ── 6. systemd service (auto-start + restart on crash) ────────────────────────
cat > /etc/systemd/system/ecommerce-web.service <<EOF
[Unit]
Description=ecommerce-web Next.js app
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/ecommerce-web
ExecStart=/home/ec2-user/.nvm/versions/node/$(su - ec2-user -c 'source ~/.nvm/nvm.sh && node --version')/bin/npm run start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ecommerce-web
systemctl start ecommerce-web
