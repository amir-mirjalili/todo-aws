import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    // Extract the `id` of  item from the path parameters
    const { id } = event.pathParameters!;

    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Missing Todo id' }) };
    }

    // Delete item from DynamoDB using its `id`
    await db.delete({ TableName: process.env.TODOS_TABLE!, Key: { id } }).promise();

    return { statusCode: 200, body: JSON.stringify({ message: 'Todo deleted successfully' }) };
};
