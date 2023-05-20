
import { Response, Request } from 'express';
import { BatchService } from '../BatchService';
import { TaskService } from '../TaskService';
import { getTaskClient } from '../clients/tasks';

const taskService = new TaskService(getTaskClient());
const batchService = new BatchService(taskService);

export const processFirstJob = async (request: Request, response: Response) => {
    // Process the task payload and perform the required actions
    try {
        await batchService.processFirstBatchTask(request.body);
        return response.status(200).json({ success: true });
    } catch (error: any) {
      console.error(error);
      throw error;;
    }
  };