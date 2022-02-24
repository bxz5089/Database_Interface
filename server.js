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