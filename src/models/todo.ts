export interface Todo {
    id: string;
    title: string;
    createdTime: Date;
    dueDate: Date;
    status:TodoStatus
}

export enum TodoStatus {
    DONE='Done',
    INPROGRESS='In Progress',
    TODO='Todo'
}
