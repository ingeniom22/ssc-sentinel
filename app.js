const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const fs = require('fs');
const path = require('path');
const express = require('express');

const logFilePath = path.join(__dirname, 'log.txt');
const scheduler = new ToadScheduler();
const app = express();

// Create a task that logs the current time to a file
const task = new Task('log time', () => {
    const currentTime = new Date().toLocaleTimeString();
    const logMessage = `Current time: ${currentTime}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
});

// Create a job that runs the task every 5 minutes
const job = new SimpleIntervalJob({ minutes: 5 }, task);

// Add the job to the scheduler
scheduler.addSimpleIntervalJob(job);

// Define a route to get the last 20 lines of the log file
app.get('/', (req, res) => {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        const lines = data.trim().split('\n');
        const last20Lines = lines.slice(-20).join('\n');
        res.setHeader('Content-Type', 'text/plain');
        res.send(last20Lines);
    });
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

// To stop the scheduler (e.g., when your program is shutting down):
// scheduler.stop();
