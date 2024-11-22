import {TodoStatus} from "../models/todo";

export interface UpdateTodo {
    title?: string;
    dueDate?: Date;
    status?: TodoStatus
}
