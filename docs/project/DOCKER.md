# Docker Guide - E-Storefront Platform

## 📑 Table of Contents

- [Overview](#overview)
- [Local Development](#local-development)
- [Services Architecture](#services-architecture)
- [Docker Compose](#docker-compose)

## 🌐 Overview

E-Storefront uses Docker for local development with Docker Compose for running databases and services.

| Environment | Tool           | Purpose                   |
| ----------- | -------------- | ------------------------- |
| Local Dev   | Docker Compose | Run MongoDB, Redis        |
| Production  | Railway        | Managed service hosting   |
| Frontend    | Vercel         | Static site hosting       |

## 🚀 Local Development

### Prerequisites

- Docker Desktop 4.x+
- Docker Compose 2.x+

### Quick Start

```bash
# Start databases (MongoDB + Redis)
docker-compose up -d

# Verify services running
docker-compose ps

# View logs
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Accessing Services

| Service       | URL                         | Credentials    |
| ------------- | --------------------------- | -------------- |
| MongoDB       | `mongodb://localhost:27017` | admin/password |
| Redis         | `redis://localhost:6379`    | -              |
| Mongo Express | `http://localhost:8081`     | (if enabled)   |

## 🏗️ Services Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOCKER CONTAINERS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        DATABASES                                     │   │
│  │                                                                      │   │
│  │  ┌─────────────────────┐        ┌─────────────────────┐            │   │
│  │  │     MongoDB 7.0     │        │    Redis 7 Alpine   │            │   │
│  │  │                     │        │                     │            │   │
│  │  │  Port: 27017        │        │   Port: 6379        │            │   │
│  │  │  Data: mongodb_data │        │   Data: redis_data  │            │   │
│  │  └─────────────────────┘        └─────────────────────┘            │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     │ ecommerce-network                     │
│                                     ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    LOCAL SERVICES (npm run dev)                      │   │
│  │                                                                      │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │   │
│  │  │  Auth  │ │Product │ │ Order  │ │Category│ │ Coupon │ │ Ticket │ │   │
│  │  │  4001  │ │  4005  │ │  4004  │ │  4002  │ │  4003  │ │  4006  │ │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │   │
│  │                              │                                       │   │
│  │                              ▼                                       │   │
│  │                     ┌────────────────┐                              │   │
│  │                     │ GraphQL Gateway│                              │   │
│  │                     │     4000       │                              │   │
│  │                     └────────────────┘                              │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📦 Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:7.0
    container_name: ecommerce-mongodb
    restart: unless-stopped
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: ecommerce
    volumes:
      - mongodb_data:/data/db
      - ./devops/mongo-init:/docker-entrypoint-initdb.d
    networks:
      - ecommerce-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: ecommerce-redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - ecommerce-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mongodb_data:
  redis_data:

networks:
  ecommerce-network:
    driver: bridge
```

### Commands

| Command                          | Description              |
| -------------------------------- | ------------------------ |
| `docker-compose up -d`           | Start all services       |
| `docker-compose down`            | Stop all services        |
| `docker-compose down -v`         | Stop and remove volumes  |
| `docker-compose logs -f`         | Follow logs              |
| `docker-compose ps`              | List running services    |
| `docker-compose restart mongodb` | Restart specific service |

### Data Persistence

```bash
# Volumes are persisted at:
# - mongodb_data: MongoDB data
# - redis_data: Redis data

# To reset data:
docker-compose down -v
docker-compose up -d
```

## 🔧 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Connect directly to MongoDB
docker exec -it ecommerce-mongodb mongosh -u admin -p password
```

### Redis Connection Issues

```bash
# Check if Redis is running
docker-compose ps redis

# Test Redis connection
docker exec -it ecommerce-redis redis-cli ping
```

### Reset Everything

```bash
# Stop containers and remove volumes
docker-compose down -v

# Remove unused Docker resources
docker system prune -a

# Start fresh
docker-compose up -d
```

---

See also:

- [DEPLOYMENT](./DEPLOYMENT.md) - Deployment guide
- [ENVIRONMENT](./ENVIRONMENT.md) - Environment configuration
