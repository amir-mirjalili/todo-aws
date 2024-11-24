import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { FilterTodo } from "../dto/filterTodo";
import { Todo } from "../models/todo";

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    const filters: FilterTodo = event.queryStringParameters || {};


    // Add filtering conditions dynamically
    const filterExpressions: string[] = [];
    const expressionAttributeValues: { [key: string]: string } = {};
    const expressionAttributeNames: { [key: string]: string } = {};

    if (filters.status) {
        filterExpressions.push('#status = :status');
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = filters.status;
    }
    if (filters.dueDate) {
        filterExpressions.push('#dueDate = :dueDate');
        expressionAttributeNames['#dueDate'] = 'dueDate';
        expressionAttributeValues[':dueDate'] = filters.dueDate;
    }
    const params: DynamoDB.DocumentClient.ScanInput = {
        TableName: process.env.TODOS_TABLE!,
        FilterExpression: filterExpressions.length > 0 ? filterExpressions.join(' AND ') : undefined,
        ExpressionAttributeValues: Object.keys(expressionAttributeValues).length > 0 ? expressionAttributeValues : undefined,
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
    };
    try {
        const result = await db.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items as Todo[]),
        };
    } catch (error) {
        console.error('Error querying items:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error retrieving todos' }),
        };
    }
};
