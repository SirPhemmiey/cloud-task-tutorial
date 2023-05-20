import { ITaskService } from "./TaskService";

const baseUrl = "http://whatever-your-base-url-is";

export interface IObject {
    [key: string]: any;
}

export class BatchService {

    constructor (private taskService: ITaskService) {}

    async createFirstBatchTask() {
        //create queue
        const queueName = await this.taskService.createTaskQueue('first-batch-queue');

        //add a task to the queue you created above
        await this.taskService.createTask(queueName, {
            taskName: "first-batch-task",
            url: `${baseUrl}/create-first-batch`,
            data: { //whatever data you want to pass
                operationType: "batch",
                value: 20
            }
        });
    }

    async processFirstBatchTask(data: IObject) {
        console.log(data); //{operationType: "batch", value:20}
    }
}