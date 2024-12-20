import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {APIGatewayProxyEvent, APIGatewayProxyHandler} from 'aws-lambda';
import {CreateTodo} from "../dto/createTodo";
import {Todo} from "../models/todo";

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event:APIGatewayProxyEvent) => {
    // Parse the request body into the expected DTO structure
    const body: CreateTodo = JSON.parse(event.body || '{}');
    // Validate that all required fields are provided
    if (!body.title || !body.dueDate || !body.status) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required fields: title, dueDate, or status' }),
        };
    }

    // Create a new  item with a generated UUID and current timestamp
    const todo: Todo = {
        id: uuidv4(),
        title: body.title,
        createdTime: new Date().toISOString(),
        dueDate: body.dueDate,
        status: body.status,
    };

    try {
    // Save the new  item to DynamoDB
    await db.put({ TableName: process.env.TODOS_TABLE!, Item: todo }).promise();
    }catch (e){
        console.log("error:",e)
    }

    return {
        statusCode: 201,
        body:JSON.stringify(todo),
    };
};
