-- QueryLens Demonstration SQL File
-- Query: E-Commerce Customers & Delivered Orders Summary

SELECT
    c.country,
    COUNT(o.id) AS total_orders
FROM customers c
JOIN orders o
    ON c.id = o.customer_id
WHERE c.country = 'India'
GROUP BY c.country
ORDER BY total_orders DESC
LIMIT 10;
