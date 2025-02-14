# Crypto balance simple system

## Overview


A **Crpyto balance system** built using **NestJS monorepo architecture**, consisting of two microservices:

1. **Balance Service**: Manages user crypto holdings, including CRUD operations.
2. **Rate Service**: Fetched and caches cryptocurrency exchange rates from CoinGecko.

Data is stored in local JSON files.
   Implements caching for optimized API performance via Redis.
   Includes a background job for periodic rate updates every 30 minutes.

Library tools:

1. **Axios**: A promise-based HTTP client for JavaScript that allows making requests to APIs and handling responses.
2. **ioredis**: A robust, performance-focused Redis client for Node.js.

## Architecture



### Microservices

1. **Balance Service**

    - **Responsibilities**: Manages user crypto balance.
    - **APIs**:
        - `POST /balances/add` - Add balance to user.
        - `GET /balances` - Retrieve user balance.
        - `PUT /balances/update` - Update user balance.
        - `Delete /balances/:asset` - Removes user balance asset.

2. **Rate Service**

    - **Responsibilities**: Manages integration with CoinGecko api.
    - **APIs**:
        - `GET /coin-ids?ids={assets}` - Retrieve coins data.
    - **CRON**
      - If there are users with balance, a cron job will refresh the currency rates every 30 minutes. 

## Getting Started

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your machine. \*\* Do not forget to run npm install.

### PostMan collection

For your convenience I have attached a postman collection json to this project at root folder of the project. 
import it to postman and play around.

### Unit tests

The project has Jest unit test tool, run 'npm test' to run the unit tests suites.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Danny-Web-Dev/crypto-balance.git
   cd crypto-balance
   ```
