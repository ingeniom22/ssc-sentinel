import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { pipeline } from '@xenova/transformers';
import winston from 'winston';
import { join } from 'path';
import express from 'express';
import fs from 'fs/promises';

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "app.log" }),
    ],
});

const scheduler = new ToadScheduler();
let classifier;


const createSentimentTask = () => new AsyncTask('retrieve news title', async () => {
    const newsTitle = 'Jelek sekali!';
    const output = await classifier(newsTitle);
    logger.info("Successfully inserted sentiment: ", { newsTitle, output });
});


const runTaskOnce = async () => {
    const task = createSentimentTask();
    await task.execute();
};

(async () => {
    try {
        classifier = await pipeline('sentiment-analysis', 'ingenio/indobert-sentiment-classification-onnx');
        const job = new SimpleIntervalJob({ hours: 6 }, createSentimentTask());
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