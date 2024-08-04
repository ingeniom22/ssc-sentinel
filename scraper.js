import { get } from 'https';
import { stringify } from 'querystring';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { pipeline } from '@xenova/transformers';
import logger from './logger.js';


const prisma = new PrismaClient();
const classifier = await pipeline('sentiment-analysis', 'ingenio/indobert-sentiment-classification-onnx');

function httpGet(url, params, headers) {
    return new Promise((resolve, reject) => {
        const options = {
            headers,
        };
        const reqUrl = `${url}?${stringify(params)}`;

        get(reqUrl, options, (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Request failed with status code ${res.statusCode}`));
                }
            });
        }).on('error', err => {
            reject(err);
        });
    });
}

function generateHash(title, date) {
    const hash = createHash('md5');
    hash.update(title + date);
    return hash.digest('hex');
}

export async function postToDatabase(article, region) {
    try {
        const id = generateHash(article.title, article.date);

        const existingArticle = await prisma.mediasentiment.findUnique({
            where: {
                id: id,
            },
        });

        if (existingArticle) {
            logger.info(`Article with id ${id} already exists. Skipping insertion.`);

            return;
        }

        const [{ label, score }] = await classifier(article.title);

        const newMedia = await prisma.mediasentiment.create({
            data: {
                id: id,
                region: region,
                title: article.title,
                url: article.url,
                subtitle: article.subtitle,
                subtitleUrl: article.subtitle_url,
                introtext: article.introtext,
                sTitle: article.s_title,
                sUrl: article.s_url,
                cTitle: article.c_title,
                cUrl: article.c_url,
                date: new Date(article.date),
                timesAgo: article.times_ago,
                thumb: article.thumb,
                video: article.video,
                sentiment: label,
                confidence: score,
            },
        });

        logger.info(`New article with id ${id} created.`, newMedia);
        // console.log('New article created:', newArticle);
    } catch (error) {
        logger.error(`Error creating article ${error}`);
        // console.error('Error creating article:', error);
    } finally {
        await prisma.$disconnect();
    }
}

async function scrapeTribunnews(baseUrl, params) {
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    };

    try {
        const { posts } = await httpGet(baseUrl, params, headers);
        return posts;
    } catch (error) {
        console.error(error);
    }
}

async function scrapeBekasi() {
    const base_url = "https://bekasi.tribunnews.com/ajax/latest_section";
    const params = {
        "start": 0,
        "section": "29",
        "category": "",
        "section_name": "kota-bekasi",
        "_": "1721802520518",
    };

    return scrapeTribunnews(base_url, params);
}

async function scrapeKuningan() {
    const baseUrl = "https://jabar.tribunnews.com/ajax/latest_section";
    const params = {
        "start": 0,
        "section": "2",
        "category": "50",
        "section_name": "jabar-region",
        "_": "1721697302608",
    };

    return scrapeTribunnews(baseUrl, params);
}


async function scrapeLebak() {
    const baseUrl = "https://banten.tribunnews.com/ajax/latest_section";
    const params = {
        "start": 0,
        "section": "41",
        "category": "",
        "section_name": "lebak",
        "_": "1721801411299",
    };

    return scrapeTribunnews(baseUrl, params);

}


export async function scrapeAndPostAll() {
    const bekasiPosts = await scrapeBekasi();
    const kuninganPosts = await scrapeKuningan();
    const lebakPosts = await scrapeLebak();

    bekasiPosts.forEach(post => {
        postToDatabase(post, "Bekasi");
    });

    kuninganPosts.forEach(post => {
        postToDatabase(post, "Kuningan");
    });

    lebakPosts.forEach(post => {
        postToDatabase(post, "Lebak");
    });

}

await scrapeAndPostAll();

// postToDatabase(posts[0]);