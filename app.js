import { ToadScheduler, SimpleIntervalJob, Task } from 'toad-scheduler';

// Create a new scheduler
const scheduler = new ToadScheduler();

// Create a task that logs the current time
const task = new Task('log time', () => {
    const currentTime = new Date().toLocaleTimeString();
    console.log(`Current time: ${currentTime}`);
});

// Create a job that runs the task every 5 minutes
const job = new SimpleIntervalJob({ minutes: 5 }, task);

// Add the job to the scheduler
scheduler.addSimpleIntervalJob(job);

// To stop the scheduler (e.g., when your program is shutting down):
// scheduler.stop();