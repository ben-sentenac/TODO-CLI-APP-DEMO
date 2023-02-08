import { controller } from './controller.js';

export const availableCommands = [
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
        callback: (...args) => console.log(...args)
    }
];
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

export const commandHandler = (request) => {
    const argv = request.slice(2);
    //console.log(argv.find(item => item.match(/^--[a-zA-Z0-9]+/g)));
    //const [command,option,args] = argv;
    const command = argv.find(item => item.match(/^--[a-zA-Z0-9]+/g));
    const option = argv.find(item => item.match(/^-[a-zA-Z0-9]/g));
    const args = argv.filter((item) => item.match(/^\w+/g));
    //console.log(args,option);
    const iterator = commandGenerator(availableCommands,command,option);
    const route = iterator.next().value;
    route.callback(args);
}