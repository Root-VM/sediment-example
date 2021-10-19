# Vigilance Cockpit Mobile Frontend

## Setup

Copy `.env.example` to `.env` and configure values accordingly.

## Development

Run local development server in docker with:

```
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
```

## Tests

Run tests in docker with:

```
docker-compose -f docker-compose.test.yml build
docker-compose -f docker-compose.test.yml run tests
```

## Production

Build production image with:

```
TARGET=runner docker-compose -f docker-compose.test.yml build
```
