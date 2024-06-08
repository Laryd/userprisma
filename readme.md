# UserPrisma API Documentation

Welcome to the documentation for the UserPrisma API. This RESTful API is built using Node.js and interacts with a PostgreSQL database. It provides endpoints for user authentication, user management, and user-related operations.

## Getting Started

To get started with the UserPrisma API, follow these steps:

1. **Clone the Repository**: Clone the UserPrisma repository to your local machine.

   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies using npm or yarn.

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Set Environment Variables**: Create a `.env` file in the root directory and set the following environment variables:

   ```dotenv
   PORT=3000
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run Migrations**: Run Prisma migrations to create the necessary database schema.

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the Server**: Start the server by running the following command:

   ```bash
   npm start
   ```

   The API server will start running on the specified port.

## Endpoints

### Authentication

- **POST /auth/login**: Authenticate user and generate JWT token.

  Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```

- **POST /auth/register**: Register a new user.

  Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password",
    "phone": "1234567890",
   }
  ```

### User Management

- **GET /users**: Retrieve a list of all users from the database.

- **POST /users**: Create a new user, accessible only to authenticated users with admin privileges.

  Request Body:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password",
    "phone": "0987654321",
    "isAdmin": false
  }
  ```

- **GET /users/:id**: Retrieve a specific user by their ID.

- **PUT /users/:id**: Update an existing user.

  Request Body:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com",
    "phone": "9876543210",
  }
  ```

- **DELETE /users/:id**: Delete a user from the database.
**Run Tests**: Execute the following command to run the tests:

   ```bash
   npm test
   ```

   This command will run all the tests defined in the project using Jest.

 **View Test Results**: After running the tests, you will see the test results in your terminal/console. Jest will display information about passed, failed, or pending tests along with any error messages.

 **Coverage Report (Optional)**: If you want to generate a coverage report for the tests, you can run:

   ```bash
   npm test -- --coverage
   ```

   This will generate a coverage report showing how much of your code is covered by the tests. You can find the detailed report in the `coverage` directory.

## Dependencies

- **Express**: Web framework for Node.js.
- **Prisma**: Database toolkit for PostgreSQL.
- **jsonwebtoken**: JSON Web Token implementation for Node.js.
- **bcrypt**: Library for hashing passwords.
- **dotenv**: Loads environment variables from a .env file.

## Development Dependencies

- **Jest**: JavaScript testing framework.
- **nodemon**: Utility that automatically restarts the Node.js application when file changes are detected.
- **supertest**: Library for testing HTTP servers.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests for any improvements or new features.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.