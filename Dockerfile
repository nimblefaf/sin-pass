# Используем Node.js образ
FROM node:20-alpine

# Установка рабочей директории
WORKDIR /app

# Копируем package файлы и устанавливаем зависимости
COPY package*.json ./
RUN npm install --production

# Копируем весь исходный код
COPY . .

# Компилируем TypeScript
RUN npm run build

# Открываем порт (замени на тот, который у тебя в .env)
EXPOSE 3000

# Запускаем приложение
CMD ["node", "dist/main"]
