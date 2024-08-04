import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import logger from './logger.js';
import { join } from 'path';
import express from 'express';
import fs from 'fs/promises';
import { scrapeAndPostAll } from './scraper.js';


const scheduler = new ToadScheduler();

const createSentimentTask = () => new AsyncTask('sentinel', async () => {
    await scrapeAndPostAll();

});


const runTaskOnce = async () => {
    const task = createSentimentTask();
    task.execute();
};

(async () => {
    try {
        logger.info("Application starting...");
        const job = new SimpleIntervalJob({ hours: 4 }, createSentimentTask());
        scheduler.addSimpleIntervalJob(job);
        await runTaskOnce();
        logger.info("Initial task executed successfully.");
    } catch (error) {
        logger.error("Error during initialization:", error);
    }
})();

const app = express();

app.get('/', async (req, res) => {
    try {
        const logPath = join(__dirname, 'app.log');
        const data = await fs.readFile(logPath, 'utf8');
        const lines = data.split('\n').filter(Boolean);
        const lastLines = lines.slice(-50);
        res.json(lastLines);
    } catch (error) {
        logger.error('Error reading log file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 3000;
app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}/`);
});

process.on('SIGINT', () => {
    scheduler.stop();
    process.exit(0);
});