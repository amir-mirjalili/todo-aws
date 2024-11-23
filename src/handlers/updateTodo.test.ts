import { handler } from './updateTodo';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('aws-sdk', () => {
    const mDocumentClient = {
        update: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({}),
    };
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => mDocumentClient),
        },
    };
});

describe('Update Todo Lambda Function', () => {
    const mockContext: Context = {} as any;

    beforeAll(() => {
        process.env.TODOS_TABLE = 'TodosTable';
    });

    afterAll(() => {
        delete process.env.TODOS_TABLE;
    });

    it('should update a todo item', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: { id: '12345' },
            body: JSON.stringify({ title: 'Updated Todo', status: 'Completed', dueDate: '2024-12-10' }),
        } as any;

        const result = await handler(event, mockContext, () => null);
        if (result) {
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body).message).toBe('Todo updated successfully');
        }
        });

    it('should handle missing fields gracefully', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: { id: '12345' },
            body: JSON.stringify({}),
        } as any;

        const result = await handler(event, mockContext, () => null);
        if (result) {
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body).message).toBe('Todo updated successfully');
        }
    });
});
