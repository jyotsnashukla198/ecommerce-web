#!/bin/bash
set -e
sudo dnf install git -y
sudo dnf install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
docker --version
git clone https://github.com/jyotsnashukla198/ecommerce-web.git
cd ecommerce-web
sudo docker build --no-cache -t ecommerce-web2 -f Dockerfile .
sudo docker run -d -p 3000:3000 \
  -e DATABASE_URL=postgresql://postgres:password@database-1.cluster-cj84u08a0h8y.ap-south-1.rds.amazonaws.com:5432/postgres \
  -e JWT_SECRET=fdcb2adcf27af609b5aaf4331e946a53ef08e526bd7d45890c41d565ae680428 \
  ecommerce-web2