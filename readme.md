# Backend Task

### Description

Backend task for a Junior Backend Developer position at Nebula X Company.

## Table of Contents

- [Requirements](#requirements)
- [Solution](#solution)
- [Features](#features)
- [Installation](#installation)
- [Technologies](#technologies)

## Requirements

- **Product API Management**: Create, Update, Edit, Delete
- **Cart API Management**: Add, Modify, Display
- **Postman Collection**: find it in Product_Cart_API.postman_collection.json file

## Solution

### Product API Routes

| Method | Endpoint           | Description                   | Request Body/Params                                              |
| ------ | ------------------ | ----------------------------- | ---------------------------------------------------------------- |
| GET    | `api/products`     | Get a list of all products    | N/A                                                              |
| GET    | `api/products/:id` | Get a product by its ID       | `id` (URL param)                                                 |
| POST   | `api/products`     | Create a new product          | `{ name, price, quantity, image ,salePrice}`                     |
| PUT    | `api/products/:id` | Edit entire product by its ID | `{ name, price, quantity, image ,salePrice }` , `id` (URL param) |
| PATCH  | `api/products/:id` | Update a product by its ID    | `{ name ,price ,.... }` , `id` (URL param)                       |
| DELETE | `api/products/:id` | Delete a product by its ID    | `id` (URL param)                                                 |

### Cart API Routes

#### Assume there is one cart

| Method | Endpoint              | Description               | Request Body/Params                                     |
| ------ | --------------------- | ------------------------- | ------------------------------------------------------- |
| GET    | `api/cart`            | Get cart details          | N/A                                                     |
| GET    | `api/cart/totals`     | Get cart Totals           | N/A                                                     |
| POST   | `api/cart`            | Add a product to the cart | `{ productId, quantity }`                               |
| PATCH  | `api/cart/:productId` | Update cart item quantity | `{ Quantity }` (Request Body) , `productId` (URL param) |
| DELETE | `api/cart/:productId` | Remove an item from cart  | `productId` (URL param)                                 |

## Features

- **Image Uploading**:
  Image uploading and store it localy in upload folder

- **Error Handling**:  
  Comprehensive error handling with appropriate HTTP status codes and descriptive error messages.
- **Logging**:  
  Ensure proper logging of requests and errors to simplify debugging and system monitoring.
- **Query Optimization**:  
  Use Mongoose query optimizations to enhance performance when fetching and updating data.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/aboodmagdy1/Backend-Task-Nebula-X
   cd Backend-Task-Nebula-X
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run Dev Mode**:
   ```bash
   npm run start:dev
   ```
4. **Run Production Mode**:
   ```bash
   npm run start:prod
   ```

## Technologies

- Backend :
  - [NodeJS](https://nodejs.org/en/)
  - [Express](http://expressjs.com/)
  - [Mongoose](https://mongoosejs.com/)
