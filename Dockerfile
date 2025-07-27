FROM node:18-alpine as build

# Build React frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Build Node.js backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Final stage - serve both frontend and backend
FROM node:18-alpine
WORKDIR /app

# Copy backend
COPY --from=build /app/server ./
# Copy built frontend to serve as static files
COPY --from=build /app/client/build ./public

# Serve static files from Express
RUN npm install express-static

EXPOSE 8080

CMD ["npm", "start"]