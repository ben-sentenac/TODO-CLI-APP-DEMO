import assert from 'node:assert/strict';
import test from 'node:test';

import data from './data.json' assert {type: "json"};

import { commandGenerator } from '../../src/command_handler.js';

import { getAllTodos, getFilteredTodo,addNewTodo } from '../../src/controller.js';



test('Unit test suite for todoapp controller', async (t) => {
    await t.test('Test getAllToDo should print all todos', (t) => {
        const todos = getAllTodos(data);
        assert.deepEqual(todos, [...data]);
    });
    await t.test('Test getFilteredTodo should return the right todo', (t) => {
        let args = ['name=my-custom-task2'];
        let todoTest = getFilteredTodo(data, args);
        assert.deepEqual(todoTest[0], data[1]);
        assert.equal(todoTest.length, 1);
        args = ['completed=true'];
        todoTest = getFilteredTodo(data, args);
        assert.deepEqual(todoTest, [data[0], data[2]]);
        args = ['id=1'];
        todoTest = getFilteredTodo(data, args);
        assert.deepEqual(todoTest, [data[0]]);
        assert.ok(todoTest.length === 1);
        //todo filter by date
    });
    await t.test('Test getFilteredTodo should return empty array when args is null or undefined', (t) => {
        let args = '';
        let todoTest = getFilteredTodo(data, args);
        assert.deepEqual(todoTest, []);
        assert.equal(todoTest.length, 0);
        args = undefined;
        todoTest = getFilteredTodo(data, args);
        assert.deepEqual(todoTest, []);
        assert.ok(todoTest.length === 0);
    });
    await t.test('Test getFilteredTodo should return undefined if data is undefined or null', (t) => {
        let args = ['name=ben'];
        let todoTest = getFilteredTodo(null, args);
        assert.deepEqual(todoTest, []);
    });
});

test('Add new todo test suite', async (t) => {
        await t.test('It should return a new  task',(t) => {
            const todoMap = addNewTodo(['My-super-todo','tasks=go to cinema, buy a clone']);
            assert.equal(typeof todoMap,'object');
            assert.ok(todoMap.has('id'));
            assert.ok(todoMap.has('name'));
            assert.ok(todoMap.has('completed'));
            assert.ok(todoMap.has('tasks'));
            assert.ok(Array.isArray(todoMap.get('tasks')));
            assert.ok(todoMap.has('at'));
    });
});

test('Generator function test suite', async (t) => {
    const commandDataTest = [
        {
            name: 'any',
            options: [
                {
                    name: 'other',
                    callback: (args) => args
                }
            ]
        },
        {
            name:'haha',
            options:null,
            callback:() => 'hello from callback'
        }
    ];
    await t.test('it should return the right iterator', (t) => {
        let iterator = commandGenerator(commandDataTest,'any','other');
        let command = iterator.next().value;
        assert.equal(command.name,'other');
        assert.equal(command.callback('other'),'other');
        iterator = commandGenerator(commandDataTest,'haha','');
         command = iterator.next().value;
         iterator = commandGenerator(commandDataTest,'haha',null);
         command = iterator.next().value;
        assert.equal(command.name,'haha');
        assert.equal(command.callback(),'hello from callback');
        iterator = commandGenerator(commandDataTest,'any',['other','g']);
         command = iterator.next().value;
        assert.equal(command.name,'any');

    });
});