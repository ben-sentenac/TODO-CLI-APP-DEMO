import { commandHandler } from './command_handler.js';


const noArgumentMessageText = `
Usage: todo --new <todo_name> <tasks>

Todo list app to manage tasks

Arguments:
  todo_name                  name of the todo
  tasks                      tasks list
Options:
  --first                 display just the first todo
  -h, --help              display help for command

`;



//--list
//--new taskname  [tasks,...] 
//--list -s name=taskname




commandHandler(process.argv);




