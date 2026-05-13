@echo off
REM China IT News Auto Publisher - Run Script
REM Called by Windows Task Scheduler

set PATH=C:\Program Files\Git\bin;%PATH%
set http_proxy=http://127.0.0.1:7890
set https_proxy=http://127.0.0.1:7890

cd /d "C:\Users\fushu\Documents\trae_projects\cnitnews"
"C:\Program Files\nodejs\node.exe" auto-publisher.js >> auto-publisher.log 2>&1
