const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYUlIeHpVaGFjSjRtZEdPMERhdGcvQm8zWUlSQ2dDdS9vaDFXenc2QTcxaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRUNGY2F1ZUdxYjlTY0VSYVpEZndDMS9HWFFMZUdaKzNVWk8zdHlHSnZVcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJnSCs3emNBYUNQcEZadEpyQ1Q1Z1RWUm9xMmcxa041VjI5bzlXKzVtRDFNPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2STRMNGxIdEM1ZjBYTjFvL1g3TjlhVktpOWljdURwaHUwVkhhR3J1aVhFPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9JZmRUbUtSQmlkZ2NwZU9jZG5YblM1bk03NFdHckVSVXBwVWFTbUVjVTg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZQcXVmYU9jVEdNdUt2WkdEaU8rM1ZDOW1DL3FYdklwc0xKTngwS3BlbTQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMEZqM21nRUZmd2tKNWNVbjJnL3pKc2RvMEYxYS9ibTltdFVnN2lhOENtYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZEljdDBpckVIa0k4dzZSQzY1Yk54Z0ZNMUlpMW1Oeit5L0NkUlRMU3lWND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZ3dTlxbm5oN1dDQzlCNGdEdHRoWW5EdjY5RWk0cWZld25XMnFGd3FibkJQWkU5V0hvTnlhWVpVTkdPdnc2TWdqcnBHU1k1cHFsTGVLRy9KdG1IRWlnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTczLCJhZHZTZWNyZXRLZXkiOiIyd3dacktXeEZXUDdLL3VaN0NzbEFaYUdUbDVBTzdGZE9lMDkzS08xckZnPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjIzNDkwNjkzNzE3MDdAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiRDJDODZFQTExOURERUE3NzM2Q0IxNDIwRUU1OEI2MEMifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc0ODY4NDQ3NX1dLCJuZXh0UHJlS2V5SWQiOjYxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6NjEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiMTIzTE9UVVMiLCJtZSI6eyJpZCI6IjIzNDkwNjkzNzE3MDc6MTRAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiOTZnZHV1IiwibGlkIjoiMjUwMTM1MjcxNDQ4NTkzOjE0QGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUFRFejk0RUVLZWQ2OEVHR0FZZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoidFZpd3NSQms1SDZkekFQZWdEbGVzM3ZQR3JvdjQwSjFJNGcrR01DN2gzRT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiR2hxWTFDc216QkFhSE4rNmRDNHQ1bkJJbFJ3aFZQMmJGdDI4SmttRUh4SWoySmk3L2QzMXdHMWg2ZjJzcWgvcmJhMVliaTNETzQ0b1pzNFFZYWVkQUE9PSIsImRldmljZVNpZ25hdHVyZSI6ImdZcytPeFBOVFFWZzZieHVuK1BXcGRaUEROck1mOXY2VWVlMHZRL05GZHpTaDlTbmpuODVJenp5Tm1yMUZTcS9wdDFIQ3I3QWlVZnRld2pJNnVwNGd3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM0OTA2OTM3MTcwNzoxNEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJiVllzTEVRWk9SK25jd0Qzb0E1WHJON3p4cTZMK05DZFNPSVBoakF1NGR4In19XSwicGxhdGZvcm0iOiJzbWJhIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQWdJQWc9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NDg2ODQ0NzAsImxhc3RQcm9wSGFzaCI6Im5tM0JiIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFBWjIifQ==',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Ibrahim Adams",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " Ibrahim Adams",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    ANTICALL : process.env.ANTICALL || 'no',   
    AUTO_BIO : process.env.AUTO_BIO || 'no',               
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'yes',              
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

