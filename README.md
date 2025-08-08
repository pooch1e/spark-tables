## Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Testing](#testing)
- [TODO](#todo)

## Overview

Spark Forge is an inspiration table generator for creative writing or role playing games - so far, it features:

- **Topics**: Top-level categories
- **Themes**: Organized sections within topics
- **Subthemes**: Subdivisions of themes
- **Descriptors**: Individual data points within subthemes

DRIZZLE ORM

# Generate migration files

npx drizzle-kit generate:pg

# Run migrations

npm run db:migrate

# Or push schema directly (like prisma db push)

npm run db:push

# Spark Tables

A hierarchical data management system built with Next.js and Drizzle ORM, designed to organize information through topics, themes, subthemes, and descriptors.

## Database Schema

The application uses Drizzle ORM with PostgreSQL. The database consists of four main tables with a clear hierarchical relationship:

```mermaid
erDiagram
    topics {
        serial id PK
        text name
        text description
    }
    themes {
        serial id PK
        text name
        integer order
        integer topic_id FK
    }
    subthemes {
        serial id PK
        text name
        integer order
        integer theme_id FK
    }
    descriptors {
        serial id PK
        text text
        integer subtheme_id FK
    }
    topics ||--o{ themes : "has many"
    themes ||--o{ subthemes : "has many"
    subthemes ||--o{ descriptors : "has many"
```

# ERD

```mermaid
erDiagram
    topics {
        serial id PK
        text name
        text description
    }

    themes {
        serial id PK
        text name
        integer order
        integer topic_id FK
    }

    subthemes {
        serial id PK
        text name
        integer order
        integer theme_id FK
    }

    descriptors {
        serial id PK
        text text
        integer subtheme_id FK
    }

    topics ||--o{ themes : "has many"
    themes ||--o{ subthemes : "has many"
    subthemes ||--o{ descriptors : "has many"
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd spark-tables
```

2. Install dependencies

```bash
npm install
```

3. Set up your environment variables

```bash
# Copy the example env file
cp .env.example .env.local

# Add your database connection string - will shortly be moving this to supabase
DATABASE_URL="postgresql://username:password@localhost:5432/spark_tables"
```

4. Set up the database

```bash
# Generate migration files
npx drizzle-kit generate:pg

# Run migrations
npm run db:migrate

# Alternative: Push schema directly 
npm run db:push
```

5. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Topics

| Method   | Endpoint                  | Description                      |
| -------- | ------------------------- | -------------------------------- |
| `GET`    | `/api/topics`             | List all topics                  |
| `GET`    | `/api/topics/[id]`        | Get single topic                 |
| `POST`   | `/api/topics`             | Create new topic                 |
| `PUT`    | `/api/topics/[id]`        | Update topic _(stretch goal)_    |
| `DELETE` | `/api/topics/[id]`        | Delete topic                     |
| `GET`    | `/api/topics/[id]/themes` | Get themes for a topic (ordered) |
| `GET`    | `/api/topics/[id]/all`    | Get topic with all nested data   |

### Themes

| Method   | Endpoint           | Description                   |
| -------- | ------------------ | ----------------------------- |
| `GET`    | `/api/themes`      | List all themes               |
| `GET`    | `/api/themes/[id]` | Get single theme              |
| `POST`   | `/api/themes`      | Create new theme              |
| `PUT`    | `/api/themes/[id]` | Update theme _(stretch goal)_ |
| `DELETE` | `/api/themes/[id]` | Delete theme                  |

### Subthemes & Descriptors

| Method | Endpoint                          | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| `GET`  | `/api/subthemes/[id]/descriptors` | Get descriptors for a subtheme |

### Global Endpoints

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| `GET`  | `/api/full` | Full tree structure |

### Search (Extension Features)

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| `GET`  | `/api/search?q=term`             | Search across all levels |
| `GET`  | `/api/topics/[id]/search?q=term` | Search within a topic    |

### Example API Usage

```javascript
// Get all topics
const topics = await fetch('/api/topics').then((res) => res.json());

// Create a new topic
const newTopic = await fetch('/api/topics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Topic',
    description: 'A description of my topic',
  }),
});

// Get topic with all nested data
const fullTopic = await fetch('/api/topics/1/all').then((res) => res.json());
```

## Development

### Database Operations

```bash
# Generate new migration files after schema changes
npx drizzle-kit generate:pg

# Apply migrations to database
npm run db:migrate

# Push schema changes directly (development only)
npm run db:push

# Start development server with hot reload
npm run dev
```

### Project Structure

```
├── src/
│   ├── app/
│   │   └── api/           # API route handlers
│   ├── lib/
│   │   ├── db/            # Database configuration and schema
│   │   └── utils/         # Utility functions
│   └── types/             # TypeScript type definitions
├── drizzle/               # Migration files
└── drizzle.config.ts      # Drizzle configuration
```

## Testing

This project uses integration testing for API routes. Testing setup includes:

- [next-test-api-route-handler](https://www.npmjs.com/package/next-test-api-route-handler) for testing Next.js API routes
- Integration testing patterns from [Arcjet's Next.js testing guide](https://blog.arcjet.com/testing-next-js-app-router-api-routes/)

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## TODO

### Priority Items

- [ ] Add comprehensive error handling and edge cases to endpoint testing
  - [ ] Return better messaging when topic ID doesn't exist
  - [ ] Handle invalid request parameters
  - [ ] Add proper HTTP status codes for different scenarios
- [ ] Add error handling for themes with invalid topic_id references
- [ ] Create and serve `endpoints.json` at `/api` to document all available endpoints

### Stretch Goals

- [ ] Implement UPDATE endpoints for topics and themes
- [ ] Add authentication and authorization
- [ ] Implement soft deletes with restore functionality
- [ ] Add data validation and sanitization
- [ ] Create comprehensive API documentation with OpenAPI/Swagger
- [ ] Add caching layer for frequently accessed data
- [ ] Implement bulk operations for themes and subthemes

### Extension Features

- [ ] Advanced search functionality with filters and sorting
- [ ] Export capabilities (JSON, CSV)
- [ ] Import functionality with validation
- [ ] Real-time updates with WebSocket support
- [ ] API rate limiting and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# TODO

- add error handling and edge cases to endpoint testing eg if no topic exists on id return better messaging to user
- add error handling for themes with no topic id
- add endpoint.json to track all endpoints, serve up on /api

# Intergration testing with

https://blog.arcjet.com/testing-next-js-app-router-api-routes/
https://www.npmjs.com/package/next-test-api-route-handler#install
