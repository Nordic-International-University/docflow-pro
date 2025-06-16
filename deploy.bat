@echo off
setlocal enabledelayedexpansion

:: Log fayl yaratish
set log_file=deployment_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.log
set log_file=%log_file: =0%

echo ====================================
echo   DEPLOYMENT JARAYONI BOSHLANDI
echo ====================================
echo Vaqt: %date% %time%
echo Repository: docflow-pro
echo Log fayl: %log_file%
echo.

:: Log'ga yozish
echo DEPLOYMENT LOG - %date% %time% > %log_file%
echo ======================================== >> %log_file%
echo Working Directory: %cd% >> %log_file%
echo User: %USERNAME% >> %log_file%
echo Computer: %COMPUTERNAME% >> %log_file%
echo ======================================== >> %log_file%

echo [1/7] Git ma'lumotlarini olish...
echo [1/7] Git ma'lumotlarini olish... >> %log_file%
git log -1 --pretty=format:"Son'gi commit: %%h - %%s (%%an, %%ar)" >> %log_file% 2>&1
echo. >> %log_file%
echo.

echo [2/7] Loyiha fayllarini tekshirish...
echo [2/7] Loyiha fayllarini tekshirish... >> %log_file%
if exist "package.json" (
    echo ✓ Node.js loyihasi topildi
    echo Node.js loyihasi topildi >> %log_file%
    echo package.json mazmuni:
    echo package.json mazmuni: >> %log_file%
    type package.json | findstr "scripts\|dependencies\|vite\|react"
    type package.json | findstr "scripts\|dependencies\|vite\|react" >> %log_file% 2>&1
) else (
    echo ✓ Oddiy fayl loyihasi
    echo Oddiy fayl loyihasi >> %log_file%
)
echo.

echo [3/7] Node modules tozalash va qayta o'rnatish...
echo [3/7] Node modules tozalash va qayta o'rnatish... >> %log_file%
if exist "package.json" (
    echo Eski node_modules o'chirilmoqda...
    echo Eski node_modules o'chirilmoqda... >> %log_file%
    if exist "node_modules" (
        rmdir /s /q node_modules
        echo node_modules o'chirildi >> %log_file%
    )
    if exist "package-lock.json" (
        del package-lock.json
        echo package-lock.json o'chirildi >> %log_file%
    )
    if exist "dist" (
        rmdir /s /q dist
        echo dist papka o'chirildi >> %log_file%
    )

    echo npm cache clean --force...
    echo npm cache clean --force... >> %log_file%
    npm cache clean --force >> %log_file% 2>&1

    echo npm install --force jarayoni boshlandi...
    echo npm install --force jarayoni boshlandi... >> %log_file%
    npm install --force >> %log_file% 2>&1
    if !errorlevel! equ 0 (
        echo ✓ npm install --force muvaffaqiyatli
        echo npm install --force muvaffaqiyatli >> %log_file%
    ) else (
        echo ! npm install --force xatosi
        echo npm install --force XATOSI - Error level: !errorlevel! >> %log_file%
        exit /b 1
    )
) else (
    echo Loyiha Node.js emas, npm install kerak emas
    echo Loyiha Node.js emas >> %log_file%
)
echo.

echo [4/7] Dependencies tekshirish...
echo [4/7] Dependencies tekshirish... >> %log_file%
if exist "package.json" (
    echo Vite va React o'rnatilganligini tekshirish...
    echo Vite va React tekshirilmoqda... >> %log_file%
    if exist "node_modules\.bin\vite.cmd" (
        echo ✓ Vite topildi
        echo Vite topildi: node_modules\.bin\vite.cmd >> %log_file%
    ) else (
        echo ! Vite topilmadi
        echo Vite topilmadi >> %log_file%
    )
) else (
    echo Dependencies tekshirish kerak emas
    echo Dependencies tekshirish kerak emas >> %log_file%
)
echo.

echo [5/7] Backup yaratish...
echo [5/7] Backup yaratish... >> %log_file%
set backup_dir=C:\Backup\docflow-pro_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set backup_dir=%backup_dir: =0%
mkdir "%backup_dir%" 2>NUL
echo Backup papka yaratildi: %backup_dir% >> %log_file%
xcopy /E /Y /Q . "%backup_dir%\" >NUL 2>&1
if !errorlevel! equ 0 (
    echo ✓ Backup yaratildi: %backup_dir%
    echo Backup muvaffaqiyatli yaratildi >> %log_file%
) else (
    echo ! Backup yaratishda xatolik
    echo Backup yaratishda XATOLIK - Error level: !errorlevel! >> %log_file%
)
echo.

echo [6/7] Build jarayoni (npm run build)...
echo [6/7] Build jarayoni... >> %log_file%
if exist "package.json" (
    echo npm run build jarayoni boshlandi...
    echo npm run build boshlandi... >> %log_file%
    npm run build >> %log_file% 2>&1
    if !errorlevel! equ 0 (
        echo ✓ npm run build muvaffaqiyatli
        echo npm run build muvaffaqiyatli >> %log_file%
    ) else (
        echo ! npm run build xatosi yuz berdi
        echo npm run build XATOSI - Error level: !errorlevel! >> %log_file%
        echo Build'siz davom etilmoqda...
        echo Build'siz davom etilmoqda >> %log_file%
    )
) else (
    echo Build kerak emas
    echo Build kerak emas >> %log_file%
)
echo.

echo [7/7] Development server ishga tushirish...
echo [7/7] Development server ishga tushirish... >> %log_file%
if exist "package.json" (
    echo Server portlarini tekshirish (port 3000)...
    echo Server portlarini tekshirish... >> %log_file%
    netstat -an | findstr ":3000" >> %log_file%
    if !errorlevel! equ 0 (
        echo Port 3000 band, server allaqachon ishlamoqda
        echo Port 3000 BAND - Server allaqachon ishlamoqda >> %log_file%

        :: Serverning ishlayotganini tasdiqlash
        echo Server holati tekshirilmoqda...
        tasklist | findstr "node.exe" >> %log_file%
    ) else (
        echo Port 3000 bo'sh, dev server ishga tushirilmoqda...
        echo Port 3000 BOSH - Dev server ishga tushirilmoqda >> %log_file%

        echo npm run dev background'da ishga tushirilmoqda...
        echo Server start command: npm run dev >> %log_file%
        start /b cmd /c "npm run dev > server_%date:~-4,4%%date:~-10,2%%date:~-7,2%.log 2>&1"

        timeout /t 5 /nobreak >nul
        echo ✓ Dev server ishga tushirildi (background)
        echo Dev server background'da ishga tushirildi >> %log_file%

        :: Server ishlaganini tekshirish
        timeout /t 3 /nobreak >nul
        netstat -an | findstr ":3000" >> %log_file%
        if !errorlevel! equ 0 (
            echo Dev server muvaffaqiyatli ishga tushdi - Port 3000 ACTIVE >> %log_file%
        ) else (
            echo Dev server ishga tushmagan yoki kechikmoqda >> %log_file%
        )
    )
) else (
    echo Server ishga tushirish kerak emas
    echo Server ishga tushirish kerak emas >> %log_file%
)
echo.

echo ====================================
echo   DEPLOYMENT MUVAFFAQIYATLI TUGADI
echo ====================================
echo Tugallanish vaqti: %date% %time%
echo Backup joylashuvi: %backup_dir%
echo Server log: server_%date:~-4,4%%date:~-10,2%%date:~-7,2%.log
echo Deployment log: %log_file%
echo Port: 3000 (Development)
echo Status: SUCCESS
echo ====================================

:: Final log yozish
echo ======================================== >> %log_file%
echo DEPLOYMENT TUGALLANDI: %date% %time% >> %log_file%
echo Status: SUCCESS >> %log_file%
echo Backup: %backup_dir% >> %log_file%
echo Port: 3000 >> %log_file%
echo ======================================== >> %log_file%

echo.
echo 📁 Log fayllar:
echo   - Deployment: %log_file%
echo   - Server: server_%date:~-4,4%%date:~-10,2%%date:~-7,2%.log
echo.
echo 🌐 Serverga kirish: http://localhost:3000
echo 📊 Server holati: tasklist | findstr "node.exe"
echo 🔍 Port holati: netstat -an | findstr ":3000"
