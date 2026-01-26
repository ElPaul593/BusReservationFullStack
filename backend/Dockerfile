FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el resto del código
COPY . .

# El puerto se toma de la variable de entorno PORT (Render la define automáticamente)
ENV PORT=5000

# Exponer el puerto
EXPOSE 5000

# Comando para iniciar en producción
CMD ["npm", "start"]
