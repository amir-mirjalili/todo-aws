import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { FilterTodo } from "../dto/filterTodo";
import { Todo } from "../models/todo";

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    const filters: FilterTodo = event.queryStringParameters || {};
    const params: DynamoDB.DocumentClient.ScanInput = {
        TableName: process.env.TODOS_TABLE!,
    };

    // Add filtering conditions dynamically
    const filterExpressions: string[] = [];
    const expressionAttributeValues: { [key: string]: string } = {};

    if (filters.status) {
        filterExpressions.push('status = :status');
        expressionAttributeValues[':status'] = filters.status;
    }
    if (filters.dueDate) {
        filterExpressions.push('dueDate = :dueDate');
        expressionAttributeValues[':dueDate'] = filters.dueDate;
    }

    if (filterExpressions.length > 0) {
        params.FilterExpression = filterExpressions.join(' AND ');
        params.ExpressionAttributeValues = expressionAttributeValues;
    }

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
