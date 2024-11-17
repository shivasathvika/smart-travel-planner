# Travel Planner Deployment Guide

This guide explains how to deploy the Travel Planner application to a production environment.

## Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- PostgreSQL 12+
- Domain name (for HTTPS setup)
- Linux server (Ubuntu 20.04 LTS recommended)

## Environment Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd travel-planner
```

2. Install Python dependencies:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your production values:
```
# Database
DB_HOST=your-db-host
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-jwt-secret
JWT_ALGORITHM=HS256

# API Keys
WEATHER_API_KEY=your-weather-api-key
MAPS_API_KEY=your-maps-api-key

# Email
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password

# Server
PORT=3000
NODE_ENV=production
```

## Database Setup

1. Create PostgreSQL database:
```bash
sudo -u postgres psql
CREATE DATABASE travel_planner_db;
CREATE USER travel_planner_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE travel_planner_db TO travel_planner_user;
```

2. Run database migrations:
```bash
psql -U travel_planner_user -d travel_planner_db -f setup_database.sql
```

## Server Configuration

1. Install and configure Nginx:
```bash
sudo apt update
sudo apt install nginx
```

2. Create Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Set up SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Application Deployment

1. Build frontend assets:
```bash
npm run build
```

2. Set up PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name travel-planner
pm2 startup
pm2 save
```

3. Configure backend service:
Create `/etc/systemd/system/travel-planner.service`:
```ini
[Unit]
Description=Travel Planner Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/path/to/travel-planner
Environment="PATH=/path/to/travel-planner/.venv/bin"
ExecStart=/path/to/travel-planner/.venv/bin/python run.py
Restart=always

[Install]
WantedBy=multi-user.target
```

4. Start the service:
```bash
sudo systemctl start travel-planner
sudo systemctl enable travel-planner
```

## Security Measures

1. Configure firewall:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

2. Set up fail2ban:
```bash
sudo apt install fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

3. Regular updates:
```bash
sudo apt update
sudo apt upgrade
```

## Monitoring Setup

1. Install monitoring tools:
```bash
npm install -g pm2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

2. Configure logging:
```bash
mkdir -p logs
touch logs/error.log
touch logs/access.log
```

## Backup Configuration

1. Set up database backups:
Create `/etc/cron.daily/backup-db`:
```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U travel_planner_user travel_planner_db > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
find "$BACKUP_DIR" -type f -mtime +7 -delete
```

2. Make the script executable:
```bash
chmod +x /etc/cron.daily/backup-db
```

## Performance Optimization

1. Enable Nginx caching:
```nginx
proxy_cache_path /path/to/cache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;

server {
    location / {
        proxy_cache my_cache;
        proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
        proxy_cache_valid 200 60m;
    }
}
```

2. Configure compression:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## Maintenance

Regular maintenance tasks:

1. Log rotation:
```bash
sudo logrotate -f /etc/logrotate.d/travel-planner
```

2. Database optimization:
```bash
psql -U travel_planner_user -d travel_planner_db -c "VACUUM ANALYZE;"
```

3. Monitor disk space:
```bash
df -h
du -sh /path/to/travel-planner/*
```

## Troubleshooting

Common issues and solutions:

1. Application not starting:
- Check logs: `journalctl -u travel-planner`
- Verify environment variables
- Check database connection

2. Database connection issues:
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database credentials
- Verify network connectivity

3. Nginx issues:
- Check configuration: `sudo nginx -t`
- View logs: `sudo tail -f /var/log/nginx/error.log`

## Support

For additional support:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` directory

## Updates and Maintenance

To update the application:

1. Pull latest changes:
```bash
git pull origin main
```

2. Install dependencies:
```bash
pip install -r requirements.txt
npm install
```

3. Build frontend:
```bash
npm run build
```

4. Restart services:
```bash
sudo systemctl restart travel-planner
pm2 restart travel-planner
```
