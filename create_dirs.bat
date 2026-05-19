@echo off
REM Create Backend directories
md "backend\src\models" 2>nul
md "backend\src\routes" 2>nul
md "backend\src\controllers" 2>nul
md "backend\src\middleware" 2>nul
md "backend\src\services" 2>nul
md "backend\src\config" 2>nul
md "backend\src\utils" 2>nul
md "backend\uploads" 2>nul

REM Create Frontend directories
md "frontend\src\components\common" 2>nul
md "frontend\src\components\customer" 2>nul
md "frontend\src\components\admin" 2>nul
md "frontend\src\components\shared" 2>nul
md "frontend\src\pages\customer" 2>nul
md "frontend\src\pages\admin" 2>nul
md "frontend\src\pages\auth" 2>nul
md "frontend\src\redux" 2>nul
md "frontend\src\services" 2>nul
md "frontend\src\hooks" 2>nul
md "frontend\src\utils" 2>nul
md "frontend\public" 2>nul

echo All directories created!
