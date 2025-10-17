# Multi-stage Dockerfile for OMS Frontend (React/Vite)
# Optimized for Railway deployment

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

# Stage 2: Production stage with Nginx
FROM nginx:alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

# Create a completely custom nginx configuration
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/nginx.conf

# Create custom nginx.conf
RUN cat > /etc/nginx/nginx.conf << 'EOF'
worker_processes auto;
error_log /var/log/nginx/error.log notice;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    
    server {
        listen 8080;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Enable gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_proxied expired no-cache no-store private auth;
        gzip_types
            text/plain
            text/css
            text/xml
            text/javascript
            application/javascript
            application/xml+rss
            application/json;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
            
            # Security headers
            add_header X-Frame-Options "SAMEORIGIN" always;
            add_header X-Content-Type-Options "nosniff" always;
            add_header X-XSS-Protection "1; mode=block" always;
            add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Security: deny access to hidden files
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }
    }
}
EOF

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Verify the copy worked
RUN echo "Verifying copied files:" && \
    ls -la /usr/share/nginx/html/ && \
    test -f /usr/share/nginx/html/index.html && echo "✅ index.html found" || echo "❌ index.html missing"

# Create nginx cache directory and set proper permissions
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Switch to non-root user
USER nginx

# Expose port (Railway will override this with PORT env var)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]