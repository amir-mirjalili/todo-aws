import {TodoStatus} from "../models/todo";

export interface FilterTodo {
    status?: TodoStatus;
    createdTime?: Date;
    dueDate?: string;
}
