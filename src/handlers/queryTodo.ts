import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import {FilterTodo} from "../dto/filterTodo";
import {Todo} from "../models/todo";

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    const filters: FilterTodo = event.queryStringParameters || {};
    const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: process.env.TODOS_TABLE!,
    };

    if (filters.status) {
        params.IndexName = 'StatusIndex';
        params.KeyConditionExpression = 'status = :status';
        params.ExpressionAttributeValues = { ':status': filters.status };
    } else if (filters.createdTime) {
        params.IndexName = 'CreatedTimeIndex';
        params.KeyConditionExpression = 'createdTime = :createdTime';
        params.ExpressionAttributeValues = { ':createdTime': filters.createdTime };
    } else if (filters.dueDate) {
        params.IndexName = 'DueDateIndex';
        params.KeyConditionExpression = 'dueDate = :dueDate';
        params.ExpressionAttributeValues = { ':dueDate': filters.dueDate };
    }

    const result = await db.query(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(result.Items as Todo[]),
    };
};
