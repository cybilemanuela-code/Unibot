@echo off
REM Rename componenets folder to components
cd /d "c:\Users\Manuela\Desktop\Unibot\Unibot_web\src"
if exist "componenets" (
    ren componenets components
    echo Folder renamed successfully from componenets to components
) else (
    echo Folder componenets not found
)
