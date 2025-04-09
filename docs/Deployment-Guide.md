# ACES Platform Deployment Guide

This document provides detailed instructions for deploying the ACES Platform to production environments.

## Prerequisites

- Node.js v14+ and npm v7+
- MongoDB v4.4+
- Redis (for caching and session storage)
- Nginx (for reverse proxy and SSL termination)
- SSL certificate
- Domain name with DNS configured
- Server with minimum 2GB RAM, 2 CPU cores

## Deployment Environments

### Development
- Used for active development
- Features: detailed error messages, debug logging
- No rate limiting

### Staging
- Used for pre-production testing
- Features: production-like environment with test data
- Isolated from production database

### Production
- Used for live user traffic
- Features: optimized for performance, security, and stability
- Strict rate limiting, minimal logging, no debugging info

## Environment Variables

Create a `.env` file for each environment with the following variables:

```
# Server Configuration
NODE_ENV=production
PORT=5000
API_URL=https://api.aces-platform.com
CLIENT_URL=https://aces-platform.com

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aces_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=noreply@acesplatform.com
SMTP_PASSWORD=your_email_password
FROM_EMAIL=noreply@acesplatform.com
FROM_NAME=ACES Platform

# Google OAuth (if used)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis Configuration (for caching)
REDIS_URL=redis://127.0.0.1:6379

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

## Deployment Steps

### 1. Server Setup

#### Update System
```bash
sudo apt update
sudo apt upgrade -y
```

#### Install Node.js
```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Should show v14.x.x
npm -v   # Should show v7.x.x
```

#### Install MongoDB (if not using Atlas)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Install Redis
```bash
sudo apt install redis-server -y
sudo systemctl enable redis-server
```

#### Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

### 2. Application Deployment

#### Clone Repository
```bash
git clone https://github.com/yourusername/aces-platform.git
cd aces-platform
```

#### Install Dependencies
```bash
npm ci --production
```

#### Create Environment File
```bash
cp .env.example .env
# Edit the .env file with production values
```

#### Initialize Database Indexes
```bash
node scripts/create-indexes.js
```

#### Test Application
```bash
node server.js
# Should start without errors
```

#### Set Up PM2 for Process Management
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 3. Nginx Configuration

Create a new Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/aces-platform
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name api.aces-platform.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.aces-platform.com;

    ssl_certificate /etc/letsencrypt/live/api.aces-platform.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.aces-platform.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Logging
    access_log /var/log/nginx/api.aces-platform.com-access.log;
    error_log /var/log/nginx/api.aces-platform.com-error.log;

    # Proxy settings
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly
    location /uploads {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        root /path/to/aces-platform;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/aces-platform /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 4. SSL Certificate with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.aces-platform.com
```

### 5. Set Up Backup Scripts

Create a cron job for database backups:

```bash
crontab -e
```

Add the following line to run backups at 2 AM every day:

```
0 2 * * * /usr/bin/node /path/to/aces-platform/scripts/backup.js >> /path/to/aces-platform/logs/backup.log 2>&1
```

### 6. Monitoring Setup

#### Install and configure Prometheus Node Exporter

```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.3.1/node_exporter-1.3.1.linux-amd64.tar.gz
tar xvfz node_exporter-1.3.1.linux-amd64.tar.gz
cd node_exporter-1.3.1.linux-amd64
sudo cp node_exporter /usr/local/bin/
sudo useradd -rs /bin/false node_exporter

sudo nano /etc/systemd/system/node_exporter.service
```

Add the following to the service file:

```
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
```

Start and enable the service:

```bash
sudo systemctl daemon-reload
sudo systemctl start node_exporter
sudo systemctl enable node_exporter
```

## Deployment Verification

### Health Check
Verify the application is running correctly by checking the health endpoint:

```bash
curl https://api.aces-platform.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2023-06-10T12:34:56.789Z",
  "uptime": 1234.56,
  "database": {
    "status": "connected"
  },
  "memoryUsage": {
    "rss": 123456789,
    "heapTotal": 123456789,
    "heapUsed": 123456789,
    "external": 123456789
  }
}
```

### API Test
Test a public API endpoint:

```bash
curl https://api.aces-platform.com/api/events
```

## Updating the Application

### Automated Updates with Git and PM2

```bash
cd /path/to/aces-platform
git pull origin main
npm ci --production
pm2 reload ecosystem.config.js --env production
```

### Rollback Procedure

In case of issues, roll back to the previous version:

```bash
cd /path/to/aces-platform
git log -n 10 --oneline  # Find the last stable commit hash
git checkout <commit-hash>
npm ci --production
pm2 reload ecosystem.config.js --env production
```

## Maintenance Procedures

### Log Rotation

Configure log rotation to prevent disk space issues:

```bash
sudo nano /etc/logrotate.d/aces-platform
```

Add the following configuration:

```
/path/to/aces-platform/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reload ecosystem.config.js --env production > /dev/null 2>/dev/null || true
    endscript
}
```

### Scheduled Database Maintenance

Add a cron job for database optimization:

```bash
crontab -e
```

Add the following line to run every Sunday at 3 AM:

```
0 3 * * 0 /usr/bin/node /path/to/aces-platform/scripts/db-maintenance.js >> /path/to/aces-platform/logs/db-maintenance.log 2>&1
```

### Security Updates

Regularly update system packages:

```bash
sudo apt update
sudo apt upgrade -y
sudo reboot  # if needed
```

## Troubleshooting

### Common Issues and Solutions

#### Application Won't Start

Check the logs:
```bash
pm2 logs aces-platform
```

Check environment variables:
```bash
cat .env  # Make sure all variables are set correctly
```

#### MongoDB Connection Issues

Check if MongoDB is running:
```bash
sudo systemctl status mongod
```

Verify connection string:
```bash
mongo "mongodb+srv://username:password@cluster.mongodb.net/aces_db"
```

#### Nginx Configuration Problems

Test Nginx configuration:
```bash
sudo nginx -t
```

Check Nginx logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

#### SSL Certificate Issues

Verify certificate:
```bash
sudo certbot certificates
```

Renew certificate:
```bash
sudo certbot renew --dry-run
```

## Contact

For deployment issues, contact:
- DevOps Team: devops@aces-platform.com
- Emergency Support: +1-123-456-7890 