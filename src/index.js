import process from 'node:process';
import { commandHandler } from './command_handler.js';

const toDo = Object.create(null);

toDo.start = () => {
  //todo handler
  commandHandler(process.argv);
};

export { toDo };





