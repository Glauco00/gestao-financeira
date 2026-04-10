FROM node:20-slim

WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm install --production

# Copia o resto dos arquivos
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
