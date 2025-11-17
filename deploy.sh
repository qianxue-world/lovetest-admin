#!/bin/bash

# Deployment script for activation code admin dashboard

echo "🚀 Building Docker image..."
docker build -t activation-code-admin:latest .

echo "✅ Build complete!"
echo ""
echo "📦 To run locally:"
echo "   docker run -d -p 8080:80 --name admin-dashboard activation-code-admin:latest"
echo ""
echo "🌐 Access at: http://localhost:8080"
echo ""
echo "🐳 To use docker-compose:"
echo "   docker-compose up -d"
echo ""
echo "☁️  To deploy to cloud VM:"
echo "   1. Save image: docker save activation-code-admin:latest | gzip > admin-dashboard.tar.gz"
echo "   2. Transfer to VM: scp admin-dashboard.tar.gz user@your-vm-ip:~/"
echo "   3. On VM: docker load < admin-dashboard.tar.gz"
echo "   4. On VM: docker run -d -p 80:80 --restart always activation-code-admin:latest"
