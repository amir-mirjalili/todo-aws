# Todo API

This project is a serverless API for managing Todo items, built with AWS Lambda, DynamoDB, and TypeScript.

## Prerequisites

- AWS Account
- Serverless Framework installed
- Node.js and npm installed

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amir-mirjalili/todo-aws.git
   cd todo-aws
2. Install dependencies
    ```bash
   npm install

## Usage

### Deploy to AWS
   ```bash
   npm run deploy
   ```
### Run Tests
   ```bash
   npm run test
   npm run test:watch
   ````
## API Documentation

### Endpoints

---

#### 1. **Create Todo**
- **Method**: `POST`
- **URL**: `/todos`

##### Request Body:
   ```json
   {
     "title": "Learn AWS",
     "dueDate": "2024-11-25",
     "status": "In Progress"
   }
   ```
#### 2. **Update Todo**
- **Method**: `PUT`
- **URL**: `/todos/{id}`

 **Path Parameter:**:
- ```id```(string): id


##### Request Body:
   ```json
   {
     "title": "Learn AWS",
     "status": "In Progress"
   }
   ```
##### Response:
   ```json
   {
   "id": "123e4567-e89b-12d3-a456-426614174000",
   "title": "Learn AWS",
   "createdTime": "2024-11-20T12:34:56.789Z",
   "dueDate": "2024-11-25",
   "status": "In Progress"
   }
   ```
#### 3. **Delete Todo**
- **Method**: `DELETE`
- **URL**: `/todos/{id}`

**Path Parameter:**:
- ```id```(string): `/todos/{id}`

##### Response:
   ```json
   {
   "message": "Todo deleted successfully"
   }
   ```
#### 4. **List Todo**
- **Method**: `GET`
- **URL**: `/todos`

**Query Parameters(Optional):**:
- ```status```(string): 
- ```dueDate```(string): 

##### Response:
   ```json
   [
   {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Learn AWS",
      "createdTime": "2024-11-20T12:34:56.789Z",
      "dueDate": "2024-11-25",
      "status": "In Progress"
   },
   {
      "id": "223e4567-e89b-12d3-a456-426614174111",
      "title": "Setup CI/CD",
      "createdTime": "2024-11-21T14:00:00.000Z",
      "dueDate": "2024-11-30",
      "status": "Todo"
   }
]

   ```
