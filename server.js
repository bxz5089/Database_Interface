// const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");
require('dotenv').config();
require("console.table");

const PORT = process.env.PORT || 3001;
// const app = express();

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
  },
  console.log(`Connected to the employees_db database.`)
);

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

//View all departments/ READ all, SELECT * FROM
function viewAllDepartments() {
  console.log("Viewing all departments\n");

  let query =`
      SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      LEFT JOIN role r
      ON e.role_id = r.id
      LEFT JOIN department d
      ON d.id = r.department_id
      LEFT JOIN employee m
      ON m.id = e.manager_id
      `

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Departments viewed!\n");

    menuPrompt();
  });

}