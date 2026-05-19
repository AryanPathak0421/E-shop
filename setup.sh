#!/bin/bash
# Setup script for MERN E-Commerce Platform

echo "Creating directory structure..."

# Backend directories
mkdir -p backend/src/config
mkdir -p backend/src/models  
mkdir -p backend/src/routes
mkdir -p backend/src/controllers
mkdir -p backend/src/middleware
mkdir -p backend/src/services
mkdir -p backend/src/utils
mkdir -p backend/uploads

# Frontend directories  
mkdir -p frontend/src/components/common
mkdir -p frontend/src/components/customer
mkdir -p frontend/src/components/admin
mkdir -p frontend/src/components/shared
mkdir -p frontend/src/pages/customer
mkdir -p frontend/src/pages/admin
mkdir -p frontend/src/pages/auth
mkdir -p frontend/src/redux/slices
mkdir -p frontend/src/services
mkdir -p frontend/src/hooks
mkdir -p frontend/src/utils
mkdir -p frontend/public

echo "✓ All directories created successfully!"
echo ""
echo "Next steps:"
echo "1. Copy backend files to backend/src/ directories"
echo "2. Copy frontend files to frontend/src/ directories"  
echo "3. Run: cd backend && npm install"
echo "4. Run: cd ../frontend && npm install"
echo "5. Create .env files in backend and frontend"
echo "6. Run: npm run dev (in both directories)"
