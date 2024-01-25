const { createPromptModule } = require("inquirer");

const prompt = createPromptModule();

module.exports = (db, start) => ({
  choices(table, name, value = 'id') {
    return () => db.promise()
      .query('SELECT ?? as value, ?? as name FROM ??', [value, name, table])
      .then(([rows]) => rows);
  },
  all(name) {
    return (fields) => {
      const query = 'SELECT * FROM ?? ' + (fields ? 'WHERE ?' : '');
      const values = fields ? [name, fields] : name;

      db.promise().query(query, values)
        .then(([rows]) => console.table(rows))
        .then(start);
    }
  },
  add(name) {
    return (fields) => {
      db.promise().query('INSERT INTO ?? SET ?', [name, fields])
        .then(() => console.log(Object.values(fields).slice(0,1).join(' '), 'ADDED TO', name, 'LIST'))
        .then(start);
    }
  },
  remove(name) {
    return (fields) => {
      db.promise().query('DELETE FROM ?? WHERE ?', [name, fields])
        .then(() => console.log(Object.values(fields).at(0), 'REMOVED FROM', name, 'LIST'))
        .then(start);
    }
  },
  allEmployees() {
    return this.all('employee')()
  },
  allDepartments() {
    return this.all('department')()
  },
  allRoles() {
    return this.all('role')()
  },
  addEmployee() {
    prompt([
      {
        message: 'first_name',
        name: 'first_name',
      },
      {
        message: 'last_name',
        name: 'last_name',
      },
      {
        message: 'role_id',
        name: 'role_id',
        type: 'rawlist',
        choices: this.choices('role', 'title'),
      }
    ]).then(this.add('employee'));
  },
  addDepartment() {
    prompt([
      {
        message: 'name',
        name: 'name',
      },
    ]).then(this.add('department'));
  },
  addRole() {
    prompt([
      {
        message: 'title',
        name: 'title',
      },
      {
        message: 'salary',
        name: 'salary',
      },
      {
        message: 'department_id',
        name: 'department_id',
        type: 'rawlist',
        choices: this.choices('role', 'title'),
      }
    ]).then(this.add('role'));
    return (fields) => this.add('role')(fields)
  },
  removeEmployee() {
    prompt([
      {
        message: 'id',
        name: 'id',
        type: 'rawlist',
        choices: this.choices('employee', 'first_name'),
      }
    ]).then(this.remove('employee'));
  },
  removeDepartment() {
    prompt([
      {
        message: 'id',
        name: 'id',
        type: 'rawlist',
        choices: this.choices('department', 'name'),
      }
    ]).then(this.remove('department'));
  },
  removeRole() {
    prompt([
      {
        message: 'id',
        name: 'id',
        type: 'rawlist',
        choices: this.choices('role', 'title'),
      }
    ]).then(this.remove('role'));
  },
  managersEmployees() {
    const prompt = createPromptModule();

    prompt({
      message: 'Choose a manager',
      type: 'rawlist',
      name: 'manager_id',
      choices: this.choices('employee', 'first_name'),
    }).then(this.all.bind('employee'))
  },
  exit() {
    process.exit();
  }
});
