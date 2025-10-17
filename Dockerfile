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

# Create custom nginx.conf using echo commands
RUN echo 'worker_processes auto;' > /etc/nginx/nginx.conf && \
    echo 'error_log /var/log/nginx/error.log notice;' >> /etc/nginx/nginx.conf && \
    echo '' >> /etc/nginx/nginx.conf && \
    echo 'events {' >> /etc/nginx/nginx.conf && \
    echo '    worker_connections 1024;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf && \
    echo '' >> /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf && \
    echo '    default_type application/octet-stream;' >> /etc/nginx/nginx.conf && \
    echo '    ' >> /etc/nginx/nginx.conf && \
    echo '    log_format main '\''$remote_addr - $remote_user [$time_local] "$request" '\'' ' >> /etc/nginx/nginx.conf && \
    echo '                    '\''$status $body_bytes_sent "$http_referer" '\'' ' >> /etc/nginx/nginx.conf && \
    echo '                    '\''"$http_user_agent" "$http_x_forwarded_for"'\'';' >> /etc/nginx/nginx.conf && \
    echo '    ' >> /etc/nginx/nginx.conf && \
    echo '    access_log /var/log/nginx/access.log main;' >> /etc/nginx/nginx.conf && \
    echo '    ' >> /etc/nginx/nginx.conf && \
    echo '    sendfile on;' >> /etc/nginx/nginx.conf && \
    echo '    tcp_nopush on;' >> /etc/nginx/nginx.conf && \
    echo '    keepalive_timeout 65;' >> /etc/nginx/nginx.conf && \
    echo '    ' >> /etc/nginx/nginx.conf && \
    echo '    server {' >> /etc/nginx/nginx.conf && \
    echo '        listen 8080;' >> /etc/nginx/nginx.conf && \
    echo '        server_name _;' >> /etc/nginx/nginx.conf && \
    echo '        root /usr/share/nginx/html;' >> /etc/nginx/nginx.conf && \
    echo '        index index.html;' >> /etc/nginx/nginx.conf && \
    echo '' >> /etc/nginx/nginx.conf && \
    echo '        # Enable gzip compression' >> /etc/nginx/nginx.conf && \
    echo '        gzip on;' >> /etc/nginx/nginx.conf && \
    echo '        gzip_vary on;' >> /etc/nginx/nginx.conf && \
    echo '        gzip_min_length 1024;' >> /etc/nginx/nginx.conf && \
    echo '        gzip_proxied expired no-cache no-store private auth;' >> /etc/nginx/nginx.conf && \
    echo '        gzip_types' >> /etc/nginx/nginx.conf && \
    echo '            text/plain' >> /etc/nginx/nginx.conf && \
    echo '            text/css' >> /etc/nginx/nginx.conf && \
    echo '            text/xml' >> /etc/nginx/nginx.conf && \
    echo '            text/javascript' >> /etc/nginx/nginx.conf && \
    echo '            application/javascript' >> /etc/nginx/nginx.conf && \
    echo '            application/xml+rss' >> /etc/nginx/nginx.conf && \
    echo '            application/json;' >> /etc/nginx/nginx.conf && \
    echo '' >> /etc/nginx/nginx.conf && \
    echo '        # Handle client-side routing' >> /etc/nginx/nginx.conf && \
    echo '        location / {' >> /etc/nginx/nginx.conf && \
    echo '            try_files $uri $uri/ /index.html;' >> /etc/nginx/nginx.conf && \
    echo '            ' >> /etc/nginx/nginx.conf && \
    echo '            # Security headers' >> /etc/nginx/nginx.conf && \
    echo '            add_header X-Frame-Options "SAMEORIGIN" always;' >> /etc/nginx/nginx.conf && \
    echo '            add_header X-Content-Type-Options "nosniff" always;' >> /etc/nginx/nginx.conf && \
    echo '            add_header X-XSS-Protection "1; mode=block" always;' >> /etc/nginx/nginx.conf && \
    echo '            add_header Referrer-Policy "strict-origin-when-cross-origin" always;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '' >> /etc/nginx/nginx.conf && \
    echo '        # Cache static assets' >> /etc/nginx/nginx.conf && \
    echo '        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {' >> /etc/nginx/nginx.conf && \
    echo '            expires 1y;' >> /etc/nginx/nginx.conf && \
    echo '            add_header Cache-Control "public, immutable";' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '' >> /etc/nginx/nginx.conf && \
    echo '        # Health check endpoint' >> /etc/nginx/nginx.conf && \
    echo '        location /health {' >> /etc/nginx/nginx.conf && \
    echo '            access_log off;' >> /etc/nginx/nginx.conf && \
    echo '            return 200 "healthy\\n";' >> /etc/nginx/nginx.conf && \
    echo '            add_header Content-Type text/plain;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '' >> /etc/nginx/nginx.conf && \
    echo '        # Security: deny access to hidden files' >> /etc/nginx/nginx.conf && \
    echo '        location ~ /\\. {' >> /etc/nginx/nginx.conf && \
    echo '            deny all;' >> /etc/nginx/nginx.conf && \
    echo '            access_log off;' >> /etc/nginx/nginx.conf && \
    echo '            log_not_found off;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '    }' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf

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