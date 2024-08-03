const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const fs = require('fs');
const http = require('http');
const path = require('path');

const logFilePath = path.join(__dirname, 'log.txt');
const scheduler = new ToadScheduler();

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

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(logFilePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            const lines = data.trim().split('\n');
            const last20Lines = lines.slice(-20).join('\n');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(last20Lines);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the HTTP server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

// To stop the scheduler (e.g., when your program is shutting down):
// scheduler.stop();
