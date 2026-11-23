# ComponentHub - Electronics Lab Component Request & Validation System

Node.js + Express app demonstrating **server-side validation**, GET/POST handling, routing, middleware and JSON responses.

Author: Gaurav Pravin Patil | PRN 202401100049 | Div A | Batch A2

## Run
```
npm install
npm start        # http://localhost:3000
npm test         # 20 validation tests
```

## API
| Method | Route | Purpose |
|---|---|---|
| GET | / | Web interface |
| GET | /api/health | Server status |
| GET | /api/requests | List all requests |
| GET | /api/requests/:id | Get one request |
| POST | /api/requests | Submit a request (validated) |

## Structure
server.js, routes/, controllers/, middleware/, services/, utils/, public/, tests/

## Deploy (Render)
Build: `npm install` | Start: `npm start`
