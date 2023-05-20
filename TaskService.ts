
import {CloudTasksClient} from "@google-cloud/tasks";
import { google } from "@google-cloud/tasks/build/protos/protos";

export interface TaskOptions {
    taskName: string, 
    url: string, 
    eta?: number, //in seconds
    data: any
}

export interface ITaskService {
    createTaskQueue(queueName: string, opt?: {concurrency?: number, dispatches?: number}): Promise<string>;
    createTask(queueName: string, options: TaskOptions): Promise<string>;
    getTask(taskName: string): Promise<[google.cloud.tasks.v2.ITask, google.cloud.tasks.v2.IGetTaskRequest, {}]>;
    deleteTask(taskName: string): Promise<[google.protobuf.IEmpty, google.cloud.tasks.v2.IDeleteTaskRequest, {}]>
}

export class TaskService implements ITaskService {

    constructor(private client: CloudTasksClient) {}

    private getQueuePath(queueName: string) {
        const parent = this.client.queuePath('your-project-id', 'us-central1', queueName);
        return parent;
    }

   async createTaskQueue(queueName: string, opts?: {concurrency?: number, dispatches: number}) {
        const parent = this.getQueuePath(queueName);
        /**
         * 1. We can control API calls using maxDispatchesPerSecond
         * 2. Rate limits allows us to define the maximum rate and maximum number of concurrent 
         * tasks that can be dispatched by a queue
         * 3. maxConcurrentDispatches sets
         */
        const queue: google.cloud.tasks.v2.IQueue = { name: parent, rateLimits: { 
            maxDispatchesPerSecond: 10, maxConcurrentDispatches: 30 
        } };
        if (opts.concurrency) {
            queue.rateLimits.maxConcurrentDispatches = opts.concurrency;
        }
        if (opts.dispatches) {
            queue.rateLimits.maxDispatchesPerSecond = opts.dispatches;
        }
        const [response] = await this.client.createQueue({ parent, queue });
        return response.name;
    }

    async createTask(queueName: string, options: TaskOptions) {
        const parent = this.getQueuePath(queueName);

        const task: google.cloud.tasks.v2.ITask = {
            name: options.taskName,
            httpRequest: {
                httpMethod: 'POST',
                url: `${options.url}`,
                body: Buffer.from(options.data).toString('base64'),
            },
            scheduleTime: { //when you want the task to run
                seconds: Date.now() / 1000
            },
        };
        if (options.eta) {
            task.scheduleTime.seconds = options.eta;
        }
        const [response] = await this.client.createTask({ parent, task});
        return response.name;
    }

    async getTask(taskName: string) {
        const fetchedTask = await this.client.getTask({
            name: taskName
        });
        return fetchedTask;
    }

    async deleteTask(taskName: string) {
        return await this.client.deleteTask({
            name: taskName
        });
    }

    async pauseQueue(queueName: string) {
        await this.client.pauseQueue({
            name: queueName,
        });
        console.log('Queue paused');
    }

    async resumeQueue(queueName: string) {
        await this.client.resumeQueue({
            name: queueName,
        });
        console.log('Queue resumed');
    }


}