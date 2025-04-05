@echo off
echo Cleaning up unused files...

REM Reports-related files
del /q "src\pages\reports-sales.jsx"
del /q "src\pages\reports-leads.jsx"
del /q "src\pages\reports-project.jsx"
del /q "src\pages\reports-timesheets.jsx"

REM Proposal-related files
del /q "src\pages\proposal-list.jsx"
del /q "src\pages\proposal-view.jsx"
del /q "src\pages\proposal-edit.jsx"
del /q "src\pages\proposal-create.jsx"

REM Customer-related files
del /q "src\pages\customers-list.jsx"
del /q "src\pages\customers-view.jsx"
del /q "src\pages\customers-create.jsx"

REM Leads-related files
del /q "src\pages\leadsList.jsx"
del /q "src\pages\leads-view.jsx"
del /q "src\pages\leads-create.jsx"

REM Payment-related files
del /q "src\pages\payment-list.jsx"
del /q "src\pages\payment-view.jsx"
del /q "src\pages\payment-create.jsx"

REM Projects-related files
del /q "src\pages\projects-list.jsx"
del /q "src\pages\projects-view.jsx"
del /q "src\pages\projects-create.jsx"

echo Cleanup complete!
pause
