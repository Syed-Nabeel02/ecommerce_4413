-- ==========================================
-- York University Merchandise Database Seed
-- ==========================================


-- ==========================================
-- INSERT CATEGORIES
-- ==========================================

INSERT INTO categories (category_id, category_name) VALUES
(1, 'Glendon'),
(2, 'Lassonde'),
(3, 'Osgoode'),
(4, 'Schulich')
ON CONFLICT (category_id) DO NOTHING;

-- ==========================================
-- INSERT PRODUCTS
-- ==========================================


-- GLENDON PRODUCTS (Category 1)
INSERT INTO products (product_id, product_name, model, description, price, quantity, image, category_id, user_id) VALUES

-- Glendon T-Shirts
(103, 'Glendon Black T-Shirt', 'T-Shirt', 'Black t-shirt featuring Glendon York University Dad branding, designed for comfort, casual wear, and proud family support.', 30.00, 1, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765689147/images/8e8c6427-a281-443a-bd7f-051f8d646209.png', 1, 2),

(104, 'Glendon White T-Shirt', 'T-Shirt', 'Clean white t-shirt with Glendon York University logo, offering a classic fit and breathable comfort for everyday wear.', 30.00, 14, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765689157/images/da290032-a4d7-474c-9b16-acdf9c05cae2.png', 1, 2),

(107, 'Glendon Blue T-Shirt', 'T-Shirt', 'Blue Glendon York University t-shirt with classic fit, soft fabric, and bold logo for casual campus style.', 30.00, 5, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765689186/images/0b507357-0ac6-4699-89b1-e5f60695d50a.png', 1, 2),

(108, 'Glendon Grey T-Shirt', 'T-Shirt', 'Grey t-shirt featuring Glendon York University logo, designed with soft fabric and classic fit for daily comfort.', 20.00, 11, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765689198/images/8ed63201-2e54-4388-957c-76b0d2c969e6.png', 1, 2),

-- Glendon Hoodies
(102, 'Glendon Blue Hoodie', 'Hoodie', 'Classic blue hoodie featuring the Glendon York University logo, soft fleece interior, adjustable hood, and front pocket for comfort.', 60.00, 40, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765689138/images/87fa17f8-5ccc-4670-b9c4-9fd5aa12ad11.png', 1, 2),

(105, 'Glendon Black Hoodie', 'Hoodie', 'Black pullover hoodie with Glendon York University logo, soft fleece fabric, adjustable hood, and everyday campus-ready comfort.', 70.00, 4, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765689169/images/758c0cfb-0e78-4a92-bfbe-19badc100bd4.png', 1, 2),

-- Glendon Joggers
(106, 'Glendon Grey Joggers', 'Pants', 'Comfortable grey joggers featuring Glendon York University logo, elastic waistband, relaxed fit, and soft fabric for everyday wear.', 50.00, 50, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765689177/images/98fe9e8d-cd41-4fb8-998e-da8c7148d862.png', 1, 2),

(109, 'Glendon Black Joggers', 'Pants', 'Black joggers featuring Glendon York University logo, elastic waistband, relaxed fit, and comfortable fabric for everyday use.', 50.00, 48, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765689209/images/7aaacd6c-fb08-4084-ac6e-426e0066bca8.png', 1, 2),

-- LASSONDE PRODUCTS (Category 2)

-- Lassonde Hoodies
(110, 'Lassonde White Hoodie', 'Hoodie', 'Classic white hoodie featuring Lassonde School of Engineering branding, soft fleece fabric, adjustable hood, and front pocket.', 70.00, 40, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691012/images/38ce68b1-1353-455c-8f7b-d76a5bab1c1f.png', 2, 2),

(111, 'Lassonde Red Hoodie', 'Hoodie', 'Bold red hoodie with Lassonde School of Engineering logo, featuring a cozy fleece interior, adjustable hood, and everyday comfort.', 70.00, 40, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691137/images/ceb5ed55-1859-422e-8ed5-e35a0a29d41f.png', 2, 2),

(112, 'Lassonde Charcoal Hoodie', 'Hoodie', 'Charcoal hoodie showcasing Lassonde School of Engineering branding, designed with soft fabric, front pocket, and relaxed campus-ready fit.', 70.00, 4, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691151/images/11cc1ba2-62a9-4fbe-b0a0-21c4e1ac6575.png', 2, 2),

-- Lassonde T-Shirts
(113, 'Lassonde White T-Shirt', 'T-Shirt', 'Clean white t-shirt with Lassonde School of Engineering branding, designed for comfort, versatility, and casual campus style.', 30.00, 15, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691178/images/dc82ec76-fa75-4b32-b162-43e4f00db698.png', 2, 2),

(114, 'Lassonde Black T-Shirt', 'T-Shirt', 'Black t-shirt featuring Lassonde School of Engineering logo, soft fabric, classic fit, and timeless design for everyday wear.', 70.00, 12, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691209/images/58514983-4cd0-4f1c-827d-aee154fe8753.png', 2, 2),

-- Lassonde Joggers
(115, 'Lassonde Grey Roots Joggers', 'Pants', 'Grey Roots joggers featuring Lassonde branding, elastic waistband, soft fabric, and relaxed fit for comfort and casual wear.', 70.00, 1, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691238/images/4309245e-9f7d-40c5-82c0-e3452bfc1600.png', 2, 2),

-- OSGOODE PRODUCTS (Category 3)

-- Osgoode Hoodies
(152, 'Osgoode Charcoal Hoodie', 'Hoodie', 'Charcoal hoodie featuring Osgoode Hall Law School branding, soft fleece interior, adjustable hood, and front pocket.', 50.00, 1, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691870/images/a8e5a020-a048-49b5-adc9-8bc0f0fdb881.png', 3, 2),

(153, 'Osgoode Red Hoodie', 'Hoodie', 'Red hoodie with Osgoode Hall Law School logo, designed with soft fleece fabric, adjustable hood, and everyday comfort.', 70.00, 30, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691900/images/66fc8a07-dbd3-49c8-a8b4-21bd3deaa637.png', 3, 2),

-- Osgoode Joggers
(154, 'Osgoode Grey Joggers', 'Pants', 'Grey joggers featuring Osgoode Hall Law School logo, elastic waistband, relaxed fit, and soft fabric for daily wear.', 60.00, 12, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691931/images/f1166e90-f30e-4cd9-b197-87caca05fbd0.png', 3, 2),

-- Osgoode T-Shirts
(155, 'Osgoode Black T-Shirt', 'T-Shirt', 'Black t-shirt featuring Osgoode Hall Law School logo, classic fit, soft fabric, and timeless design for everyday wear.', 30.00, 20, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691949/images/8bb2616f-5df7-40ec-aebb-06c84b77d396.png', 3, 2),

(156, 'Osgoode Red T-Shirt', 'T-Shirt', 'Osgoode Red T-Shirt', 30.00, 40, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765691966/images/aedd520b-4cc0-4d56-85c6-49ef5f913646.png', 3, 2),

-- SCHULICH PRODUCTS (Category 4)

-- Schulich Hoodies
(157, 'Schulich Blue Hoodie', 'Hoodie', 'Blue hoodie featuring Schulich School of Business branding, soft fleece interior, adjustable hood, and front pocket.', 40.00, 12, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765692208/images/5aa75097-c4eb-4dac-b0b5-3ef17f02dfda.png', 4, 2),

-- Schulich T-Shirts
(158, 'Schulich Blue T-Shirt', 'T-Shirt', 'Blue t-shirt featuring Schulich School of Business branding, designed with breathable fabric and classic fit for everyday wear.', 40.00, 12, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765692167/images/9322704c-5789-46c9-a906-fb53b9d70a27.png', 4, 2),

-- Schulich Joggers
(159, 'Schulich Grey Joggers', 'Pants', 'Grey joggers with Schulich School of Business logo, elastic waistband, soft fabric, and relaxed fit for everyday comfort.', 45.00, 40, 'https://res.cloudinary.com/dw6keglbx/image/upload/v1765692190/images/c89ebfdf-4fa3-4d65-902f-c73617c13b96.png', 4, 2)

ON CONFLICT (product_id) DO NOTHING;

-- ==========================================
-- RESET SEQUENCES TO CORRECT VALUES
-- ==========================================
-- This is CRITICAL! Since we inserted with explicit IDs, we must reset the sequences
-- Otherwise, the next insert will try to use ID 1, 2, 3, etc. which already exist

-- Use pg_get_serial_sequence to find the correct sequence name automatically
SELECT setval(pg_get_serial_sequence('categories', 'category_id'), (SELECT MAX(category_id) FROM categories));
SELECT setval(pg_get_serial_sequence('products', 'product_id'), (SELECT MAX(product_id) FROM products));

