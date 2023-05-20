import { CloudTasksClient } from "@google-cloud/tasks";

// Instantiates a cloud task client.
const client = new CloudTasksClient({
    credentials: 'your-service-account' as any, //don't cast to `any` in your project
    projectId: 'your project-id',
});

export const getTaskClient = () => client;
