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

connection.connect(function(err) {
  if (err) throw err;
  readProducts();
});

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      // for(var i=0; i<res.length; i++){
      //   console.log(`Item ID: ${res[i].item_id}`);
      //   console.log(`Product: ${res[i].product_name}`);
      //   console.log(`Department: ${res[i].department_name}`);
      //   console.log(`Price: $${res[i].price}`);
      //   console.log(`Stock Available: ${res[i].stock_quantity}`);
      // }
      console.table(res);
      purchaseProduct();
    });
  }
  function purchaseProduct(){
    inquirer.prompt([
        {
          name: "itemID",
          message: "Which product would you like to purchase? (ID)",
          validate: function(value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
              return true;
            }
            return false;
          }
        },
        {
          name:"quantity",
          message: "How many would you like to buy?",
          validate: function(value) {
            if (isNaN(value) === false && parseInt(value) > 0) {
              return true;
            }
            return false;
          }
        }
      ]).then(function(answers) {
        var customerChoice = answers.itemID;
        var customerQuantity = answers.quantity;
        readProduct(customerChoice,customerQuantity);
      })
    }
function readProduct(id,userquant){
  connection.query("SELECT * FROM products", 
  function(err, res) {
    if (err) throw err;
    var quant = (res[id-1].stock_quantity);
    var price = (res[id-1].price);
    var name = (res[id-1].product_name);
    checkAvailability(id,quant,userquant,price,name);
  });
}
function checkAvailability(id, quant,userquant,price,name){
  if(quant === 0){
    console.log("Item out of stock");
  }
  else if(quant < userquant){
    console.log("Insufficient quantity, try a lower purchase amount");
    purchaseProduct();
  }
  else{
  updateProduct(id,quant,userquant,price,name);
  }
}
function updateProduct(choice,quant,amount,price,name) {
  console.log("Purchasing product...\n");
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: quant - amount
      },
      {
        item_id: choice
      }
    ],
    function(err, res) {
      if (err) throw err;
      var newquant = quant - amount;
      var subtotal = price * amount;
      console.log(`Your subtotal is: ${subtotal}`);
      console.log(`There are now ${newquant} ${name} left`)
      console.log("Thank you for Shopping on Bamazon(lol)")
      connection.end();
    });
  }

           