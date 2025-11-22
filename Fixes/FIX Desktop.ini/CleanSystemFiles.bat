@echo off
echo ========================================
echo RPG Maker System File Cleaner
echo ========================================
echo.
echo This will remove the following files from your project:
echo - desktop.ini (folder settings)
echo - Thumbs.db (thumbnail cache)
echo - .DS_Store (Mac folder settings)
echo.
pause

echo.
echo Cleaning img/characters folder...
cd img\characters
del /A:H /F /Q desktop.ini 2>nul
del /A:H /F /Q Thumbs.db 2>nul
del /A:H /F /Q .DS_Store 2>nul
cd ..\..

echo Cleaning img/faces folder...
cd img\faces
del /A:H /F /Q desktop.ini 2>nul
del /A:H /F /Q Thumbs.db 2>nul
del /A:H /F /Q .DS_Store 2>nul
cd ..\..

echo Cleaning img/pictures folder...
cd img\pictures
del /A:H /F /Q desktop.ini 2>nul
del /A:H /F /Q Thumbs.db 2>nul
del /A:H /F /Q .DS_Store 2>nul
cd ..\..

echo Cleaning img/tilesets folder...
cd img\tilesets
del /A:H /F /Q desktop.ini 2>nul
del /A:H /F /Q Thumbs.db 2>nul
del /A:H /F /Q .DS_Store 2>nul
cd ..\..

echo Cleaning img/battlebacks1 folder...
cd img\battlebacks1
del /A:H /F /Q desktop.ini 2>nul
del /A:H /F /Q Thumbs.db 2>nul
del /A:H /F /Q .DS_Store 2>nul
cd ..\..

echo Cleaning img/battlebacks2 folder...
cd img\battlebacks2
del /A:H /F /Q desktop.ini 2>nul
del /A:H /F /Q Thumbs.db 2>nul
del /A:H /F /Q .DS_Store 2>nul
cd ..\..

echo Cleaning audio folders...
cd audio\bgm
del /A:H /F /Q desktop.ini 2>nul
del /A:H /F /Q Thumbs.db 2>nul
cd ..\..
cd audio\bgs
del /A:H /F /Q desktop.ini 2>nul
del /A:H /F /Q Thumbs.db 2>nul
cd ..\..
cd audio\me
del /A:H /F /Q desktop.ini 2>nul
del /A:H /F /Q Thumbs.db 2>nul
cd ..\..
cd audio\se
del /A:H /F /Q desktop.ini 2>nul
del /A:H /F /Q Thumbs.db 2>nul
cd ..\..

echo.
echo ========================================
echo Cleanup complete!
echo ========================================
echo.
pause
