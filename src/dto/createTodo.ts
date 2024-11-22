import {TodoStatus} from "../models/todo";

export interface CreateTodo {
    title: string;
    dueDate: Date;
    status: TodoStatus
}
