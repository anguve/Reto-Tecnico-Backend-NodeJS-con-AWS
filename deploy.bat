@echo off
setlocal enabledelayedexpansion

echo 🔄 Cargando variables de entorno desde .env...

REM Cargar variables de entorno
for /f "tokens=1,2* delims==" %%A in ('type .env ^| findstr /v "^$ ^#"') do (
    set "%%A=%%B"
)

echo 🌍 AWS_ACCESS_KEY_ID=!AWS_ACCESS_KEY_ID!
echo 🌍 AWS_SECRET_ACCESS_KEY=!AWS_SECRET_ACCESS_KEY!
echo 🌍 AWS_REGION=!AWS_REGION!

echo.
echo === Paso 1: Compilando TypeScript (npm run build) ===
call npm run build
if %errorlevel% neq 0 (
    echo Error al compilar TypeScript.
    exit /b 1
)
echo TypeScript compilado.

echo.
echo === Paso 2: Empaquetando Lambda con esbuild (npm run build:lambda) ===
call npm run build:lambda
if %errorlevel% neq 0 (
    echo Error al empaquetar Lambda con esbuild.
    exit /b 1
)
echo Lambda empaquetada con éxito.

echo.
echo === Paso 3: Desplegando infraestructura con AWS CDK ===
cd infra
if %errorlevel% neq 0 (
    echo No se pudo cambiar al directorio 'infra'.
    exit /b 1
)

call npm install
if %errorlevel% neq 0 (
    echo Error al instalar dependencias en 'infra'.
    exit /b 1
)

call cdk deploy
if %errorlevel% neq 0 (
    echo Error al desplegar con CDK.
    exit /b 1
)

cd ..
echo Despliegue exitoso con AWS CDK.

echo.
echo 🏁 Fin del script
