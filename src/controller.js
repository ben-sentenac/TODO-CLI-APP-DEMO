import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllTodos = (data = []) => {
    return [...data];
};


export const  getFilteredTodo = (data = [],args = []) => {
    console.log('ARGS IS' + args);
    //TODO
    if(data === null) data = [];
    if(args === undefined || args === null || args === '' || args.length == 0) return [];
    const [search,value] = args[0].split('=');
    return data.filter(todo => todo[search].toString() === value);
};

//todo filter todo by date




const controller = Object.create(null);
controller.data = await fs.readFile(path.join(__dirname,'..','data','tasks.json'));
controller.data = JSON.parse(controller.data);



controller.getTodos = (args) => {
    const data = controller.data;
    const todos = getAllTodos(data,args);
    todos.length > 0 ? console.table([...todos]): console.table(['No data found!!!']);
};
controller.getTodoByArg = (args) => {
    const data = controller.data;
    const todo = getFilteredTodo(data,args);
    todo.length > 0 ? console.table([...todo]) : console.table(['No data found!!!']);
};
export { controller };

