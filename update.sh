#!/bin/bash

set -e # Fail fast em erros

echo "Iniciando atualização da aplicação..."

cd /var/www/radar4you

echo "Executando git pull..."
git pull

echo "Instalando dependências do backend..."
cd backend
npm install

echo "Realizando build do backend..."
npm run build

echo "Rodando migrations do banco de dados..."
npx knex migrate:latest

echo "Reiniciando o backend no PM2..."
pm2 restart radar4you-api

echo "Instalando dependências e buildando frontend..."
cd ../frontend
npm install
npm run build

echo "Restartando o apache..."
sudo systemctl restart apache2

echo "Atualização concluída!"
