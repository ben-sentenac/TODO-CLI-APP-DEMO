//node builtin modules
import fs from 'node:fs/promises';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import EventEmitter from 'node:events';
//import files
import { __dirname,__filename,__FILE_TO_WRITE,writeToFile,purgeDb } from './utils/utils.js';
import { getAllTodos,getByID,getFilteredTodo,addNewTodo } from './models.js';

const noArgumentMessageText = `
Todo list cli-app to manage tasks\n
WARNING:
<This app is not bulletproof and its only for eductional purpose
Do not use it to manage your tasks>\n
Usage: todo <command> [option] <argument>
            --list                                list all registered todos
            --list     -s name="todo_name"        search todo by name/completed 
                          completed=true/false 
            --new    taskname tasks="t1,t2,..."   add a todo in database  
            --update   todo_id                    mark todo as completed
            --delete   to_id                      delete todo
            --purge                               purge db
`;

const controller = Object.create(null);

//read data
controller.data = await fs.readFile(__FILE_TO_WRITE);
//parse buffer to JSON 
controller.data = JSON.parse(controller.data);
controller.event = new EventEmitter();
//display help
controller.HELP = () => console.log(noArgumentMessageText);
//get all todos
controller.getTodos = (args) => {
    const data = controller.data.database;
    const todos = getAllTodos(data,args);
    todos.length > 0 ? console.table([...todos]): console.table(['No data found!!!']);
};
//display todos serach by name or by task completed
controller.getTodoByArg = (args) => {
    const data = controller.data.database;
    const todo = getFilteredTodo(data,args);
    todo.length > 0 ? console.table([...todo]) : console.table(['No data found!!!']);
};
//add todo in database
controller.addTodo = (args) => {
    const todo = addNewTodo(args);
    if(todo === undefined) {
        console.log('oops something went wrong...:(');
        return;
    }
    console.log('Success! new todo added!');
    console.table(todo);
};
//chage todo "completed" status true or false
controller.markAsCompleted = async (args) => {
    //search task by name 
    const searchTodo  = getByID(controller.data.database,args);
    if(searchTodo && searchTodo.name) {
        const { completed } = searchTodo;
        const word = completed ? 'imcompleted':'completed';
        const rl = readline.createInterface({input,output});
        const question = await rl.question(`Are you sure to mark your task as ${ word } ? [type y to confirm n to exit]`);
        switch(question) {
            case 'y':
                const rewriteData = controller.data.database.map(todo => {
                    if(todo === searchTodo) {
                        todo.completed = !todo.completed
                        todo.at = new Date().toLocaleString();
                    }
                    return todo
                });
                //rewrite the data
                try {
                     await writeToFile(__FILE_TO_WRITE,rewriteData)
                } catch (error) {
                    controller.event.emit('error','WRITE_FILE_ERROR',);
                }
                //done!
                //display the modified todo
                controller.getTodoByArg(['name=' + searchTodo.name]);
                rl.close();
                break;
            case 'n':
                rl.close();
                break;
            default:
                console.log('Invalid choice program has closed!');
                rl.close();
                break;
       }
    }
   
};

//Purge db
controller.purge = async () => {
     purgeDb(__FILE_TO_WRITE,controller.data.database).then(() => console.log('Database is empty!'))
};

export { controller };

