# PowerShell script to start all services in separate windows

Write-Host "Starting all services..." -ForegroundColor Green

# Kill any existing node processes to free ports
Write-Host "Stopping old processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force 2>$null
Start-Sleep -Seconds 1

# Check if Redis is running
Write-Host "Checking Redis..." -ForegroundColor Cyan
$redisRunning = Get-Process redis-server -ErrorAction SilentlyContinue
if (-not $redisRunning) {
    Write-Host "Warning: Redis server not detected. Please start Redis manually." -ForegroundColor Yellow
}

# Start API Server
Write-Host "Starting API Server on port 9000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\api-server'; node index.js"

# Wait a bit
Start-Sleep -Seconds 2

# Start S3 Reverse Proxy
Write-Host "Starting S3 Reverse Proxy on port 8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\s3-reverse-proxy'; node index.js"

# Wait a bit
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend on port 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend-nextjs'; npx next dev"

Write-Host "`nAll services started!" -ForegroundColor Green
Write-Host "`nServices running at:" -ForegroundColor Yellow
Write-Host "  Frontend:         http://localhost:3000"
Write-Host "  API Server:       http://localhost:9000"
Write-Host "  Socket Server:    http://localhost:9002"
Write-Host "  Reverse Proxy:    http://localhost:8000"
