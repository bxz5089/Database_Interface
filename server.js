const mysql = require('mysql2');
const inquirer = require("inquirer");
const express = require('express');
const { Console } = require('console');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + db.threadId);
  menuPrompt();
});

function menuPrompt() {

  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Select database functions:",
      choices: [
        "View all departments", 
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "End"]
    })
    .then(function ({ task }) {
      switch (task) {
        case "View all departments":
          viewAllDepartments();
          break;

        case "View all roles":
          viewAllRoles();
          break;
      
        case "View all employees":
          viewAllEmployees();
          break;

        case "Add a department":
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;
        
        case "Update an employee role":
          updateEmployeeRole();
          break;

        case "End":
          connection.end();
          break;
      }
    });
}


function viewAllDepartments() {
  console.log("Viewing all departments\n");

  const query = `SELECT * FROM department;`

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    menuPrompt();
  });

}

function viewAllRoles() {
  console.log("Viewing all roles\n");

  const query = `SELECT * FROM role;`

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    menuPrompt();
  });

}

function viewAllEmployees() {
  console.log("Viewing all employees\n");

  const query = `SELECT * FROM employee;`

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    menuPrompt();
  });

}

function addDepartment() {
  console.log("Inserting an department!")

  var query =
    `SELECT r.id, r.name
     FROM department r`

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    promptAddDepartment();
  });
}

function promptAddDepartment() {

  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the new department?"
      }
    ])
    .then(function (answer) {
      console.log(answer);

      var query = `INSERT INTO department SET ?`
   
      db.query(query,
        {
          name: answer.name,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Inserted successfully!\n");

          menuPrompt();
        });
    });
}

function addRole() {
  console.log("Inserting an role!")

  var query =
    `SELECT r.id, r.title, r.salary , r.department_id
     FROM role r`

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    promptAddRole();
  });
}

function promptAddRole() {

  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the new role?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?"
      },
      {
        type: "input",
        name: "department_id",
        message: "What is the department id of the new role?"
      }
    ])
    .then(function (answer) {
      console.log(answer);

      var query = `INSERT INTO role SET ?`
   
      db.query(query,
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Inserted successfully!\n");

          menuPrompt();
        });
    });
}

function addEmployee() {
  console.log("Inserting an employee!")

  var query =
    `SELECT r.id, r.title, r.salary 
     FROM role r`

  db.query(query, function (err, res) {
    if (err) throw err;

    const employeeRoleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    promptAddEmployee(employeeRoleChoices);
  });
}

function promptAddEmployee(employeeRoleChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: employeeRoleChoices
      },
    ])
    .then(function (answer) {
      console.log(answer);

      var query = `INSERT INTO employee SET ?`
   
      db.query(query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Inserted successfully!\n");

          menuPrompt();
        });
    });
}