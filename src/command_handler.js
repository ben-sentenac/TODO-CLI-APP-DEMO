import { controller } from './controller.js';
import CLIError from './Errors/Error.js';
//App commands 
export const availableCommands = [
    {
        name:'',
        options:[
            {
                name:'-h',
                callback:controller.HELP
            }
        ],
        callback:controller.HELP
    },
    {
        name: '--list',
        options: [
            {
                name: '-s',
                callback:controller.getTodoByArg,
                args: []
            }
        ],
        callback: controller.getTodos
    },
    {
        name: '--new',
        options:null,
        callback: controller.addTodo
    },
    {
        name:'--update',
        options:{

        },
        callback:controller.markAsCompleted
    },
   {
    name:'--purge',
    options:null,
    callback:controller.purge
   }
];
//Router as generator to resolve command
// command accept 1 option but what if now option is an array
export function * commandGenerator(commandIterator = [],commandName = '',option)  {
    if(typeof commandName !== 'string' && typeof option !== 'string') return;
   for(const command of commandIterator) {
        if(command.name === commandName) {
            if(command.options && command.options.length > 0 ) {
                yield * commandGenerator(command.options,option,null)
            } 
               yield command; 
        }
   } 
}
//route handler
export const commandHandler = (request) => {
    controller.event.on('error', (code) => {
       new CLIError().handleError(code);
    });
    const argv = request.slice(2);
    const command = argv.find(item => item.match(/^--[a-zA-Z0-9]+/g));
    const option = argv.find(item => item.match(/^-[a-zA-Z0-9]/g));
    const args = argv.filter((item) => item.match(/^\w+/g));
    const iterator = commandGenerator(availableCommands,command,option);
    const route = iterator.next().value;
    route ? route.callback(args) : controller.event.emit('error','INVALID_COMMAND') //console.error('\x1b[31m','Invalid command','\x1b[0m');
}