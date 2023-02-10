import { randomUUID } from 'node:crypto';
import { controller } from './controller.js';
import { parseTask } from "./utils/utils.js";

export const getAllTodos = (data = []) => {
    return [...data];
};

export const getByID = (data = [],args) => {
    if(data === null) data = [];
    const [id,...rest] = args;
    if(!id) return [];
    return data.find(item => item.id === id);
}

export const  getFilteredTodo = (data = [],args = []) => {
    if(data === null) data = [];
    if(args === undefined || args === null || args === '' || args.length == 0) return [];
    const [search,value] = args[0].split('=');
    if(search !== 'completed' && search !== 'name') {
        controller.event.emit('error','INVALID_PARAMS');
        //console.error('\x1b[31m',`Invalid search parameter:[${search}]!!!`,'\x1b[0m');
        console.info('\x1b[31m',`Available search parameters: [name],[completed].`,'\x1b[0m');
        return [];
    } 
    return data.filter(todo => todo[search].toString() === value);
};
export const addNewTodo =  (args) => {
    if(args === '' || args.length === 0 || args === null || args === undefined) return;
    const [todoName,...rest] = parseTask(args);
    
    const separator = /[,/.#]/g;
    let tasks = rest[0] !== undefined ? rest[0].split('=')[1].split(separator) : [];

    const todo = new Map();

    todo.set("id",randomUUID());
    todo.set('name',todoName);
    todo.set('tasks',tasks);
    todo.set('completed',false);
    todo.set('at',new Date().toLocaleString());
    writeToFile(__FILE_TO_WRITE,todo);
    return todo;
};