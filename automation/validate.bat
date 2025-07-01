@echo off
REM Validate Node.js installation
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Node.js is not installed.
  exit /b 1
)

npm -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo npm is not installed.
  exit /b 1
)

REM Check if WinAppDriver is running
for /f "tokens=1" %%p in ('tasklist /nh /fi "imagename eq WinAppDriver.exe"') do (
  if /i "%%p"=="WinAppDriver.exe" (
    set WAD_RUNNING=true
  )
)
if not defined WAD_RUNNING (
  echo WinAppDriver is not running.
  exit /b 1
)

REM Verify dependencies
npm ls selenium-webdriver playwright >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Dependencies are not installed correctly.
  exit /b 1
)

echo Environment looks good.
