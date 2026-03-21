aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 188382150773.dkr.ecr.ap-south-1.amazonaws.com
docker pull 188382150773.dkr.ecr.ap-south-1.amazonaws.com/jyotsna/ecommerce:latest
docker rm -f ecommerce-web || true
docker run -d --name ecommerce-web -p 3000:3000 \
  -e DATABASE_URL="${DATABASE_URL}" \
  -e JWT_SECRET="${JWT_SECRET}" \
  188382150773.dkr.ecr.ap-south-1.amazonaws.com/jyotsna/ecommerce:latest
