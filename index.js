const mysql = require('mysql2');
const inquirer = require('inquirer');
const getActions = require('./actions');
require('console.table');

const db = mysql.createConnection({
  database: 'employees',
  user: 'root',
}, console.log('connected'));

const prompt = inquirer.createPromptModule();

const start = () => {
  prompt({
    message: 'Choose an options',
    type: 'rawlist',
    name: 'view',
    choices: [
      { name: 'View All Employees', value: 'allEmployees' },
      { name: 'View All Roles', value: 'allRoles' },
      { name: 'View All Departments', value: 'allDepartments' },
      { name: 'View Managers Employees', value: 'managersEmployees' },
      { name: 'Add Employee', value: 'addEmployee' },
      { name: 'Add Role', value: 'addRole' },
      { name: 'Add Department', value: 'addDepartment' },
      { name: 'Remove Employee', value: 'removeEmployee' },
      { name: 'Remove Role', value: 'removeRole' },
      { name: 'Remove Department', value: 'removeDepartment' },
      { name: 'Exit', value: 'exit' },
    ]
  }).then(({ view }) => actions[view]());
};

const actions = getActions(db, start);

start();
