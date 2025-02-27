# Subito.it Purchase Cart Service

This repository contains a minimal example for a Purchase Cart Service implemented using NestJS

## Overview

The application is structured into two main modules:

- **Product Module**

  - Manages product data including prices and VAT rates
  - Stores products in memory
  - Provides product retrieval by ID

- **Order Module**
  - Handles order creation and retrieval
  - Calculates total prices and VAT for orders
  - Stores orders in memory
  - Integrates with the Product module to fetch product information

## Technical Decisions

### In-Memory Storage

Instead of using a database, the application implements in-memory repositories for both products and orders in order to simplify the setup process.
This is suitable for this demonstration (though a real production system would use a persistent database).

The current implementation is oriented to use a non-relational database like MongoDB.

### Price Calculation Strategy

For this demonstration the service calculates prices and VAT at retrieval time rather than storing pre-calculated values.
This has some pros and cons:

- **Pros**: Always accurate with latest pricing data, handles dynamic pricing well, simpler data model
- **Cons**: Higher computational load on each fetch, potentially slower response times (this can be resolved partially by introducing a cache layer, but needs a mechanism to determine how often to invalidate the cache)

Another solution could be to pre-calculate and store the VAT and price,
which would provide faster response times, reduced computational load on fetch operations, and consistent pricing during a session, but requires recalculation when cart changes, with potential for stale data if prices change.

The best approach depends on factors like:

1. How frequently prices change in the system
2. Performance requirements and expected load
3. Complexity of tax calculations
4. User expectations around price consistency

A hybrid can also work well: store calculated totals in the cart but recalculate when:

- Items are added/removed/quantities changed
- A certain time has elapsed
- The cart is being prepared for checkout

But it would need a more complex system to handle this approach.

## Installation

Clone this repository on your local machine.

🚨 **Be careful** 🚨

**the project must be launched with docker, using Orbstack could cause problems with the mounting of the project on /mnt.**

**Run chmod on the script files before launching the container**

```bash
chmod +x ./scripts/*
```

Create image:

```bash
docker build -t mytest .
```

Build:

```bash
docker run -v $(pwd):/mnt -p 9090:9090 -w /mnt mytest ./scripts/build.sh
```

Test:

```bash
docker run -v $(pwd):/mnt -p 9090:9090 -w /mnt mytest ./scripts/test.sh
```

Run:

```bash
docker run -v $(pwd):/mnt -p 9090:9090 -w /mnt mytest ./scripts/run.sh
```

## Documentation

The API documentation will be available at http://localhost:9090/doc

## Testing

The application includes comprehensive end-to-end tests that:

- Test the full request/response cycle through HTTP endpoints
- Verify the integrated behavior of controllers, services, and repositories
- Confirm order creation with multiple items
- Verify price and VAT calculations at both item and order levels

Also include unit tests for `OrdersService` and `ProductsService` to ensure correctness of business logic

## Data Models

The service uses the following data models:

**Product**:

```typescript
class Product {
  product_id: string;
  name: string;
  price: number;
  // Vat cost in percent of price
  vat: number;
  description?: string;
}
```

---

**Order**:

```typescript
class Order {
  order_id: string;
  items: OrderItems[];
}

class OrderItems {
  product_id: string;
  quantity: number;
}
```

Reasons:

- Atomic Operations: cart operations (add/remove items) can be done in a single operation
- Read Performance: you'll typically need to read the entire cart at once
- Data Consistency: cart items are strongly related to the cart itself
- Query Simplicity: no need for joins/lookups

---

**Order Response**:

```typescript
class GetOrder extends Order {
  order_price: number;
  order_vat: number;
  items: GetOrderItems[];
}

class GetOrderItems extends OrderItems {
  price: number;
  vat: number;
}
```

## Next Steps

Possible improvements to be made could be the introduction of a database for data storage, like MongoDB.
Also the current infrastructure would need to be changed to allow communication between the service container and a database.
A possible solution would be to use docker-compose to orchestrate the service and the database in a network to make them communicate.

A possible docker-compose implementation would be:

```yml
services:
  mytest:
    build:
      context: ./
      dockerfile: Dockerfile
    image: mytest:latest
    env_file:
      - ./.env
    depends_on:
      - mongodb
    ports:
      - 9090:9090
    restart: always
    networks:
      local_network:
        aliases:
          - mytest

  mongodb:
    image: mongo
    restart: always
    ports:
      - 27017:27017
    networks:
      local_network:
        aliases:
          - mongo

networks:
  local_network:
```
