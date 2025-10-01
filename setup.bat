@echo off
echo Setting up Billing Software...

echo Installing backend dependencies...
cd backend
npm install
cd ..

echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo Setup complete!
echo.
echo To start the application:
echo 1. Start MongoDB
echo 2. Run 'cd backend && npm run dev' in one terminal
echo 3. Run 'cd frontend && npm start' in another terminal
pause