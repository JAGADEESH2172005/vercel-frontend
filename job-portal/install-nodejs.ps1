# PowerShell script to download and install Node.js
Write-Host "Downloading Node.js installer..." -ForegroundColor Green

# URL for the latest LTS version of Node.js for Windows
$nodeUrl = "https://nodejs.org/dist/latest/node-v20.11.1-x64.msi"
$installerPath = "$env:TEMP\nodejs-installer.msi"

try {
    # Download the installer
    Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath
    Write-Host "Download completed successfully!" -ForegroundColor Green
    
    # Install Node.js
    Write-Host "Installing Node.js..." -ForegroundColor Yellow
    Start-Process msiexec.exe -Wait -ArgumentList "/i $installerPath /quiet /norestart"
    
    Write-Host "Node.js installation completed!" -ForegroundColor Green
    Write-Host "Please restart your terminal/command prompt and run 'node --version' to verify installation." -ForegroundColor Cyan
    
    # Clean up
    Remove-Item $installerPath -Force
} catch {
    Write-Host "Error occurred during installation:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "Please manually download Node.js from https://nodejs.org/en/download/" -ForegroundColor Yellow
}