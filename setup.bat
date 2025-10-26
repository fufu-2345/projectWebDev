@echo off
pnpm install

cd apps/Backend
composer install

echo .
echo .
echo ** you can close this page **
echo .
code .