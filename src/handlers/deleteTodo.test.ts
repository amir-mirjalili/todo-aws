import { handler } from './deleteTodo';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('aws-sdk', () => {
    const mDocumentClient = {
        delete: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({}),
    };
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => mDocumentClient),
        },
    };
});

describe('Delete Todo Lambda Function', () => {
    const mockContext: Context = {} as any;

    it('should delete a todo item', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: { id: '12345' },
        } as any;

        const result = await handler(event, mockContext, () => null);
        if (result) {
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body).message).toBe('Todo deleted successfully');
        }
    });

});
