# MantenimientoProducto

1. Grilla con el listado de todos los productos. Permite exportar la lista a PDF.
2. Formulario o popup con todos los campos de la tabla Product, para ingresar o actualizar dicha información.


------------------ Script para generar la base de datos con datos de prueba -------------------

CREATE DATABASE MantenimientoProductos;

USE MantenimientoProductos;

-- Tabla ProductCategory
CREATE TABLE ProductCategory (
    category_product_id INT IDENTITY(1,1) PRIMARY KEY, -- ID único y autoincrementable
    category_description VARCHAR(255) NOT NULL,       -- Descripción de la categoría
    is_active CHAR(1) CHECK (is_active IN ('Y', 'N'))   -- Estado activo o inactivo
);

-- INSERT de categorías de ejemplo
INSERT INTO ProductCategory (category_description, is_active)
VALUES ('Electronics', 'Y'),
       ('Clothing', 'Y'),
       ('Groceries', 'N');

-- Tabla Products
CREATE TABLE Product (
    product_id VARCHAR(50) PRIMARY KEY,              -- ID único para el producto
    product_description VARCHAR(255) NOT NULL,       -- Descripción del producto
    category_product_id INT,                          -- Relación con ProductCategory
    stock INT DEFAULT 0,                            -- Stock inicial
    price DECIMAL(18, 2) DEFAULT 0.00,              -- Precio inicial
    have_EC_discount CHAR(1) CHECK (have_EC_discount IN ('Y', 'N')), -- Descuento web
    is_active CHAR(1) CHECK (is_active IN ('Y', 'N')), -- Producto activo o inactivo
    FOREIGN KEY (category_product_id) REFERENCES ProductCategory(category_product_id) -- Relación con ProductCategory
);

-- INSERT productos de ejemplo
INSERT INTO Product (product_id, product_description, category_product_id, stock, price, have_EC_discount, is_active)
VALUES ('P001', 'Smartphone', 1, 10, 599.99, 'Y', 'Y'),
       ('P002', 'T-Shirt', 2, 20, 19.99, 'N', 'Y'),
       ('P003', 'Bananas', 3, 50, 1.99, 'N', 'N');

-- verificacion
SELECT * FROM Product;
SELECT * FROM ProductCategory;
