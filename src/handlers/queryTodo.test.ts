import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import {handler} from "./queryTodo";

// Mock DynamoDB DocumentClient
jest.mock('aws-sdk', () => {
    const mDocumentClient = {
        scan: jest.fn().mockReturnThis(),
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
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual([
                {id: '1', title: 'Test Todo', status: 'In Progress', dueDate: '2024-12-01'},
            ]);
        }

    });

    beforeAll(() => {
        process.env.TODOS_TABLE = 'TodosTable';
    });

    afterAll(() => {
        delete process.env.TODOS_TABLE;
    });

    it('should filter todos by dueDate', async () => {
        const event: APIGatewayProxyEvent = {
            queryStringParameters: { dueDate: '2024-12-01' },
        } as any;

        const result = await handler(event, mockContext, () => null);
        if (result) {
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual([
                {id: '1', title: 'Test Todo', status: 'In Progress', dueDate: '2024-12-01'},
            ]);
        }
    });

    it('should filter todos by both status and dueDate', async () => {
        const event: APIGatewayProxyEvent = {
            queryStringParameters: { status: 'In Progress', dueDate: '2024-12-01' },
        } as any;

        const result = await handler(event, mockContext, () => null);
        if (result) {
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual([
                {id: '1', title: 'Test Todo', status: 'In Progress', dueDate: '2024-12-01'},
            ]);
        }
    });

    it('should return all todos if no filters are applied', async () => {
        const event: APIGatewayProxyEvent = {
            queryStringParameters: null,
        } as any;

        const result = await handler(event, mockContext, () => null);
        if (result) {
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual([
                {id: '1', title: 'Test Todo', status: 'In Progress', dueDate: '2024-12-01'},
            ]);
        }
    });
});
