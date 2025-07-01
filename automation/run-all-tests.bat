@echo off
call npm run native-test
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
call npm run web-test

