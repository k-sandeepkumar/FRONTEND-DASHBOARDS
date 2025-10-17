# Multi-stage Dockerfile for OMS Frontend (React/Vite)
# Optimized for Railway deployment using Node.js server

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using npm (Railway works better with npm)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Verify build output
RUN echo "Build completed. Checking dist directory:" && \
    ls -la dist/ && \
    echo "Checking if index.html exists:" && \
    test -f dist/index.html && echo "✅ index.html found" || echo "❌ index.html missing"

# Stage 2: Production stage with Node.js server
FROM node:18-alpine AS production

# Install dumb-init and curl for proper signal handling and health checks
RUN apk add --no-cache dumb-init curl

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create package.json and install express
RUN npm init -y && npm install express

# Create a simple server.js to serve static files
RUN echo 'const express = require("express");' > server.js && \
    echo 'const path = require("path");' >> server.js && \
    echo 'const app = express();' >> server.js && \
    echo 'const port = process.env.PORT || 8080;' >> server.js && \
    echo '' >> server.js && \
    echo '// Serve static files from dist directory' >> server.js && \
    echo 'app.use(express.static(path.join(__dirname, "dist")));' >> server.js && \
    echo '' >> server.js && \
    echo '// Health check endpoint' >> server.js && \
    echo 'app.get("/health", (req, res) => {' >> server.js && \
    echo '  res.status(200).send("healthy");' >> server.js && \
    echo '});' >> server.js && \
    echo '' >> server.js && \
    echo '// Handle client-side routing - serve index.html for all routes' >> server.js && \
    echo 'app.get("/*", (req, res) => {' >> server.js && \
    echo '  res.sendFile(path.join(__dirname, "dist", "index.html"));' >> server.js && \
    echo '});' >> server.js && \
    echo '' >> server.js && \
    echo 'app.listen(port, "0.0.0.0", () => {' >> server.js && \
    echo '  console.log(`Server running on port ${port}`);' >> server.js && \
    echo '});' >> server.js

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port (Railway will override this with PORT env var)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["node", "server.js"]