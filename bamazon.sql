DROP DATABASE IF EXISTS amazon;

CREATE DATABASE amazon;

USE amazon;

CREATE TABLE products(
item_id INT AUTO_INCREMENT,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DEC(10,2) NOT NULL,
stock_quantity INT NOT NULL,
PRIMARY KEY(item_id)
);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES("Huf Socks","Clothing",19.99,100000),
("Halo 5","Video Games",59.99,100000),
("Sprite","Grocery",1.89,100),
("Milk", "Grocery",1.79,100),
("Intex Inflatable Mattress","Home",24.99,500),
("Predators","Movie",20.00,1000);

CREATE TABLE departments(
department_id INT AUTO_INCREMENT,
department_name VARCHAR(30) NOT NULL,
over_head_costs INT NOT NULL,
product_sales INT NULL,
PRIMARY KEY(department_id)
);
INSERT INTO departments(department_name,over_head_costs,product_sales)
VALUES("Clothing",60000, 50000),
("Video Games", 100000, 120000),
("Grocery", 50000, 100000),
("Home", 75000, 150000),
("Movie", 80000, 50000);
