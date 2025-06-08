FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build React app
RUN npm run build

# Serve statički build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]
