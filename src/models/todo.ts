export interface Todo {
    id: string;
    title: string;
    createdTime: string;
    dueDate: Date;
    status:TodoStatus
}

export enum TodoStatus {
    DONE='Done',
    INPROGRESS='In Progress',
    TODO='Todo'
}
