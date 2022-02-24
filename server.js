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
        "Add department",
        "Add role",
        "Add employee",
        "Update employee role",
        "Remove employee",
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

        case "Add department":
          addDepartment();
          break;

        case "Add role":
          addRole();
          break;

        case "Add employee":
          addEmployee();
          break;
        
        case "Update employee role":
          updateEmployeeRole();
          break;

        case "Remove employee":
          removeEmployee();
          break;

        case "End":
          db.end();
          break;
      }
    });
}


function viewAllDepartments() {
  console.log("Departments Table");

  const query = `SELECT * FROM department;`

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    menuPrompt();
  });

}

function viewAllRoles() {
  console.log("Role Table");

  const query = `SELECT * FROM role;`

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    menuPrompt();
  });

}

function viewAllEmployees() {
  console.log("Employee Table");

  const query = `SELECT * FROM employee;`

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    menuPrompt();
  });

}

function addDepartment() {
  console.log("Add a department")

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
  console.log("Add a role")

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
  console.log("Add a employee")

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

function updateEmployeeRole() { 
  employeeArray();

}

function employeeArray() {
  console.log("Employee Table");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
     FROM employee e
     JOIN role r
     ON e.role_id = r.id
     JOIN department d
     ON d.id = r.department_id
     JOIN employee m
     ON m.id = e.manager_id`

  db.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`      
    }));

    console.table(res);

    roleArray(employeeChoices);
  });
}

function roleArray(employeeChoices) {
  console.log("Role Table");

  var query =
    `SELECT r.id, r.title, r.salary 
     FROM role r`
  let roleChoices;

  db.query(query, function (err, res) {
    if (err) throw err;

    roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`      
    }));

    console.table(res);


    promptEmployeeRole(employeeChoices, roleChoices);
  });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to set with the role?",
        choices: employeeChoices
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to update?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {

      var query = `UPDATE employee SET role_id = ? WHERE id = ?`
      // when finished prompting, insert a new item into the db with that info
      db.query(query,
        [ answer.roleId,  
          answer.employeeId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Updated successfully!");

          menuPrompt();
        });
    });
}

function removeEmployee() {
  console.log("Remove an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name
      FROM employee e`

  db.query(query, function (err, res) {
    if (err) throw err;

    const removeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("ArrayToDelete!\n");

    promptRemoveEmployee(removeChoices);
  });
}

function promptRemoveEmployee(removeChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: removeChoices
      }
    ])
    .then(function (answer) {

      var query = `DELETE FROM employee WHERE ?`;
      db.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted!\n");

        menuPrompt();
      });
    });
}