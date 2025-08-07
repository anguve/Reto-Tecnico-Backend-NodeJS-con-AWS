@echo off
setlocal enabledelayedexpansion

echo Loading environment variables...

REM Cargar variables de entorno desde el archivo .env
for /f "tokens=1,2* delims==" %%A in ('type .env ^| findstr /v "^$ ^#"') do (
    set "%%A=%%B"
)

REM Mostrar variables cargadas (opcional)
echo AWS_ACCESS_KEY_ID=!AWS_ACCESS_KEY_ID!
echo AWS_SECRET_ACCESS_KEY=!AWS_SECRET_ACCESS_KEY!
echo AWS_REGION=!AWS_REGION!

echo.
echo === Paso 1: Compilando TypeScript desde src/... (npm run build) ===
call npm run build
if %errorlevel% neq 0 (
    echo Error al compilar TypeScript. Revisa los errores de compilación.
    exit /b 1
)

echo Compilación de TypeScript exitosa.

echo.
echo === Paso 2: Desplegando con AWS CDK desde carpeta infra/... ===
cd infra
if %errorlevel% neq 0 (
    echo No se pudo cambiar al directorio 'infra'.
    exit /b 1
)

echo 📦 Verificando e instalando dependencias en la carpeta 'infra'...
call npm install
if %errorlevel% neq 0 (
    echo Error al instalar dependencias en 'infra'.
    exit /b 1
)

echo 🚀 Desplegando CDK...
call cdk deploy
if %errorlevel% neq 0 (
    echo Error al desplegar con CDK.
    exit /b 1
)

cd ..

echo Despliegue con AWS CDK exitoso.

echo.
echo Fin del script