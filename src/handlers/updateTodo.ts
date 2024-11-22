import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import {UpdateTodo} from "../dto/updateTodo";

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    const { id } = event.pathParameters!;

    // Parse the request body into the expected DTO structure
    const body: UpdateTodo = JSON.parse(event.body || '{}');

    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Missing Todo id' }) };
    }

    // Initialize arrays and objects to construct the DynamoDB UpdateExpression
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Check and add fields to update if they exist in the request body
    if (body.title) {
        updateExpression.push('#title = :title'); // Add the title update to the expression
        expressionAttributeNames['#title'] = 'title';
        expressionAttributeValues[':title'] = body.title;
    }
    if (body.status) {
        updateExpression.push('#status = :status'); // Add the status update to the expression
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = body.status;
    }
    if (body.dueDate) {
        updateExpression.push('#dueDate = :dueDate'); // Add the dueDate update to the expression
        expressionAttributeNames['#dueDate'] = 'dueDate';
        expressionAttributeValues[':dueDate'] = body.dueDate;
    }

    await db.update({
        TableName: process.env.TODOS_TABLE!,
        Key: { id },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
    }).promise();

    return { statusCode: 200, body: JSON.stringify({ message: 'Todo updated successfully' }) };
};
