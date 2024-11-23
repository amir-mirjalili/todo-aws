import { APIGatewayProxyEvent,Context } from 'aws-lambda';
import {handler} from "./createTodo";

jest.mock('aws-sdk', () => {
    const mDocumentClient = {
        put: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({}),
    };
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => mDocumentClient),
        },
    };
});

describe('Create Todo Lambda Function', () => {
    const mockContext: Context = {} as any;
    it('should create a todo item', async () => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                title: 'Test Todo',
                dueDate: '2024-11-30',
                status: 'In Progress',
            }),
            pathParameters: null,
            queryStringParameters: null,
            headers: null,
            requestContext: null,
            isBase64Encoded: false,
        } as any;

        const result = await handler(event, mockContext, () => null);
        if (result) {
            expect(result.statusCode).toBe(201);
            expect(JSON.parse(result.body).title).toBe('Test Todo');
            expect(JSON.parse(result.body).dueDate).toBe('2024-11-30');
            expect(JSON.parse(result.body).status).toBe('In Progress');
        }
    });

    it('should return 400 when required fields are missing', async () => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                title: '',
                dueDate: '',
                status: '',
            }),
            pathParameters: null,
            queryStringParameters: null,
            headers: null,
            requestContext: null,
            isBase64Encoded: false,
        } as any;

        const result = await handler(event,mockContext,()=>null);
        if (result) {
            expect(result.statusCode).toBe(400);
            expect(JSON.parse(result.body).message).toBe('Missing required fields: title, dueDate, or status');
        }
    });
});
