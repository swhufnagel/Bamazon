var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "poopyy.1",
    database: "amazon"
});

connection.connect(function (err) {
    if (err) throw err;
    customerDecision();
});
function customerDecision() {
    inquirer.prompt([
        {
            name: "actions",
            type: "list",
            choices: ["View Product Sale by Department", "Add New Department\n"],
        }
    ]).then(function (answers) {
        switch (answers.actions) {
            case "View Product Sale by Department": viewDepartments();
            break
            case "Add New Department\n": addDepartment();
        }
    })
}
function viewDepartments(){
    console.log("Selecting all departments...\n");
    connection.query("SELECT *,over_head_costs - product_sales as total_profit FROM departments", function (err, res)
     {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);
        console.table(res);
        customerDecision();
    });
}
function addDepartment(){
    console.log("Adding New Department...\n");
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the Department you would like to add?"
        },
        {
            name: "overhead",
            type: "input",
            message: "What is the overhead of this Department?"
        }
    ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.name,
                    over_head_costs: answer.overhead
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your new department has been created!");
                    customerDecision();
                }
            );
        });
}