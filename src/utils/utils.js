import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const __FILE_TO_WRITE = path.join(__dirname,'..','..','data','tasks.json');


/**
 * Covert Map to an Object
 * @param {Map} map 
 * @returns { Object } {}
 */
export function mapToObject (map) {
    return Array.from(map).reduce((object,[key,value]) => {
        object[key] = value;
        return object;
    },{})
}
/**
 * 
 * @param { string } filePath 
 * @param {*} data Map/Array
 * @returns Promise
 */
export async function writeToFile(filePath,data) {
    //data can be a map when add a single todo or an array 
    //if replace all database when updating todo
    let replaceDb = Array.isArray(data);
     let dataToWrite = replaceDb ? data : mapToObject(data);
    const currentFile = JSON.parse(await readFile(filePath));
    if(replaceDb) {
        console.log('replace db',currentFile);
        currentFile.database = dataToWrite;
    } else {
        const { database } = currentFile;
        database.push(dataToWrite);
    }
    return await writeFile(filePath,JSON.stringify(currentFile),{encoding:'utf-8'});
}
//purge database
 export async function  purgeDb (filePath) {
    try {
        const currentFile = JSON.parse(await readFile(filePath));
        currentFile.database = [];
        return await writeFile(filePath,JSON.stringify(currentFile),{encoding:'utf-8'});
    } catch (error) {
       console.log(error);
    }
    
};

export function parseTask(args) {
    //if space between name return the first occurence if user forget ""
    //ex todo --new my super task tasks="video,blunt" => taskname=my  tasks=['video,blunt']
    const name = args[0];
    const tasks = args.slice(1).find(item => item.match(/^tasks=/));
    return [name,tasks];
}
