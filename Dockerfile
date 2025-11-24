
FROM node:18 AS build-frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build


FROM node:18 AS build-backend

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend ./


FROM node:18

WORKDIR /app

COPY --from=build-backend /app/backend ./backend

RUN mkdir -p ./backend/public

COPY --from=build-frontend /app/frontend/dist ./backend/public

EXPOSE 5000

CMD ["npm", "start", "--prefix", "backend"]
