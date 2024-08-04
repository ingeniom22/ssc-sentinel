import { postToDatabase } from "./scraper.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path'; 
import fs from 'fs';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, 'dataset/jabar_tribunnews_kuningan.jsonl');

function processJson(json) {
    console.log('Processing:', json);
    postToDatabase(json, "Kuningan");

}

function readJsonlFile(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];

        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

        readStream.on('data', chunk => {
            // Split the chunk into lines and process each line
            const lines = chunk.split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    try {
                        const json = JSON.parse(line);
                        processJson(json);
                        results.push(json);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                }
            });
        });

        readStream.on('end', () => {
            resolve(results);
        });

        readStream.on('error', error => {
            reject(error);
        });
    });
}


(async () => {
    try {
        const jsonObjects = await readJsonlFile(filePath);
        console.log('Finished reading file:', jsonObjects);
    } catch (error) {
        console.error('Error reading file:', error);
    }
})();
