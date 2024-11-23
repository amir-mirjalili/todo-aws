import { handler } from './queryTodo';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('aws-sdk', () => {
    const mDocumentClient = {
        query: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({
            Items: [
                { id: '1', title: 'Test Todo', status: 'In Progress', dueDate: '2024-12-01' },
            ],
        }),
    };
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => mDocumentClient),
        },
    };
});

describe('Filter Todo Lambda Function', () => {
    const mockContext: Context = {} as any;

    it('should filter todos by status', async () => {
        const event: APIGatewayProxyEvent = {
            queryStringParameters: { status: 'In Progress' },
        } as any;

        const result = await handler(event, mockContext, () => null);
        if (result) {
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual([
                {id: '1', title: 'Test Todo', status: 'In Progress', dueDate: '2024-12-01'},
            ]);
        }
    });

});
