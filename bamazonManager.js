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
            choices: ["View Items", "Show Low Inventory", "Add to Inventory", "Add New Product\n"],
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) >= 0 && parseInt(value) <= 3) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        switch (answers.actions) {
            case "View Items": readProducts();
            break
            case "Show Low Inventory": inventoryCheck();
            break
            case "Add to Inventory": addInventory();
            break
            case "Add New Product\n": addProduct();
        }
    })
}
function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
    });
    customerDecision();
}
function inventoryCheck() {
    console.log("Checking for low inventory...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity < 100",
        function (err, res) {
            console.table(res);
            customerDecision();
        })
}
function addInventory() {
    console.log("Adding Inventory...\n");
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Which item would you like to add inventory for? (id)",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) >= 0 && parseInt(value) <= 3) {
                    return true;
                }
                return false;
            }
        },
        {
            name:"quantity",
            type: "input",
            message: "What is the updated quantity?",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) >= 0) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        console.log("Updating Inventory")
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            var quant = (res[answers.id-1].stock_quantity);
            console.table(res);
            console.log(quant);
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: parseInt(quant) + parseInt(answers.quantity)
                    },
                    {
                        item_id: answers.id
                    }
                ],
                function (err, res) {
                    console.log(res.affectedRows + " products updated!\n");
                    customerDecision();
                }
                );
            })
        });
        }
function addProduct() {
    console.log("Adding New Product...\n");
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the item you would like to put up for purchase?"
        },
        {
            name: "department",
            type: "input",
            message: "What departent will this item be sold in?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price you will sell it for?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many are available for sale?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.name,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your new product is now available for sale!");
                }
            );
            customerDecision();
        });
}