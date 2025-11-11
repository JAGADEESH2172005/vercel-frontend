# PowerShell script to download and install MongoDB
Write-Host "Downloading MongoDB installer..." -ForegroundColor Green

# URL for MongoDB Community Server
$mongoUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14-signed.msi"
$installerPath = "$env:TEMP\mongodb-installer.msi"

try {
    # Download the installer
    Invoke-WebRequest -Uri $mongoUrl -OutFile $installerPath
    Write-Host "Download completed successfully!" -ForegroundColor Green
    
    # Install MongoDB
    Write-Host "Installing MongoDB..." -ForegroundColor Yellow
    Start-Process msiexec.exe -Wait -ArgumentList "/i $installerPath /quiet /norestart"
    
    Write-Host "MongoDB installation completed!" -ForegroundColor Green
    Write-Host "Starting MongoDB service..." -ForegroundColor Cyan
    
    # Start MongoDB service
    Start-Service MongoDB
    
    Write-Host "MongoDB service started successfully!" -ForegroundColor Green
    
    # Clean up
    Remove-Item $installerPath -Force
} catch {
    Write-Host "Error occurred during installation:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "Please manually download MongoDB from https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
}