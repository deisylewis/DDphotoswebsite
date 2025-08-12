# D&D Photos Client Portal API

This document outlines the backend API requirements for the client portal system.

## Overview

The client portal requires a backend API to handle:
- User authentication and registration
- Payment management and Stripe integration
- Document storage and signing
- Contract and proposal management

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new client account
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### POST /api/auth/login
Login with existing credentials
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### POST /api/auth/logout
Logout and invalidate token

### Payments

#### GET /api/payments
Get all payments for the authenticated user
```json
{
  "payments": [
    {
      "id": 1,
      "description": "Wedding Photography - Silver Package",
      "amount": 1200,
      "dueDate": "2025-09-15",
      "status": "pending",
      "paidAmount": 600,
      "stripePaymentLink": "https://buy.stripe.com/..."
    }
  ]
}
```

#### POST /api/payments/create
Create a new payment record
```json
{
  "description": "Engagement Session",
  "amount": 300,
  "dueDate": "2025-08-20",
  "userId": 1
}
```

#### POST /api/payments/webhook
Stripe webhook to update payment status

### Documents

#### GET /api/documents
Get all documents for the authenticated user
```json
{
  "documents": [
    {
      "id": 1,
      "title": "Wedding Photography Contract",
      "type": "contract",
      "status": "pending_signature",
      "date": "2025-08-10",
      "content": "Contract content...",
      "signedAt": null,
      "signature": null
    }
  ]
}
```

#### POST /api/documents
Upload a new document
```json
{
  "title": "Wedding Photography Contract",
  "type": "contract",
  "content": "Contract content...",
  "userId": 1
}
```

#### POST /api/documents/:id/sign
Sign a document
```json
{
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "userId": 1
}
```

#### GET /api/documents/:id
Get specific document details

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  paid_amount DECIMAL(10,2) DEFAULT 0,
  stripe_payment_intent_id VARCHAR(255),
  stripe_payment_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Documents Table
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  content TEXT,
  status VARCHAR(50) DEFAULT 'pending_signature',
  signed_at TIMESTAMP,
  signature TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Technology Stack Recommendations

### Backend Options

#### Option 1: Node.js + Express + PostgreSQL
- **Pros**: JavaScript throughout, large ecosystem, easy deployment
- **Cons**: Requires more setup for production

#### Option 2: Python + Flask/Django + PostgreSQL
- **Pros**: Great for data processing, extensive libraries
- **Cons**: Different language from frontend

#### Option 3: PHP + Laravel + MySQL
- **Pros**: Easy hosting, great for simple applications
- **Cons**: Less modern, security concerns

### Recommended: Node.js Stack

```bash
# Project structure
portal-api/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── paymentController.js
│   │   └── documentController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Payment.js
│   │   └── Document.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── payments.js
│   │   └── documents.js
│   └── config/
│       ├── database.js
│       └── stripe.js
├── package.json
└── server.js
```

## Security Considerations

1. **JWT Authentication**: Use JWT tokens for session management
2. **Password Hashing**: Use bcrypt for password hashing
3. **Input Validation**: Validate all user inputs
4. **CORS**: Configure CORS for frontend domain
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **HTTPS**: Use HTTPS in production
7. **Environment Variables**: Store sensitive data in environment variables

## Stripe Integration

### Setup
1. Create Stripe account
2. Get API keys (publishable and secret)
3. Set up webhook endpoint
4. Configure payment links

### Payment Flow
1. Create payment record in database
2. Generate Stripe payment link
3. Send link to client
4. Handle webhook for payment confirmation
5. Update payment status in database

## Deployment Options

### Option 1: Vercel (Recommended for simplicity)
- Easy deployment from GitHub
- Automatic HTTPS
- Good for Node.js applications

### Option 2: Heroku
- Easy deployment
- Good free tier
- PostgreSQL add-on available

### Option 3: DigitalOcean
- More control
- Cost-effective for larger applications
- Requires more setup

### Option 4: AWS/GCP
- Most scalable
- More complex setup
- Better for enterprise applications

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/dndphotos

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server
PORT=3000
NODE_ENV=production
```

## Next Steps

1. Choose backend technology stack
2. Set up development environment
3. Create database and tables
4. Implement authentication endpoints
5. Add payment management
6. Implement document signing
7. Set up Stripe integration
8. Deploy to production
9. Test all functionality
10. Monitor and maintain

## Testing

Use tools like:
- **Postman**: API testing
- **Jest**: Unit testing
- **Supertest**: Integration testing
- **Stripe CLI**: Webhook testing

## Monitoring

- **Logging**: Winston or Morgan
- **Error Tracking**: Sentry
- **Performance**: New Relic or DataDog
- **Uptime**: UptimeRobot or Pingdom



