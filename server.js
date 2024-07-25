const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Mock database (in-memory)
const products = [];

// Authentication Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        // Here you would verify the token, for example using a library like jsonwebtoken.
        // For simplicity, we're assuming the token is valid if provided.
        req.token = token;
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Endpoint to register a company (from previous example)
app.post("/register", authenticate, async (req, res) => {
    try {
        const data = {
            "company name": "goMart",
            "ownerEmail": "owner@example.com"
        };

        const response = await axios.post('https://20.244.56.144/test/register', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.token}`
            }
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to add product data
app.post('/products', authenticate, (req, res) => {
    try {
        const newProducts = req.body;
        products.push(...newProducts);
        res.status(201).json({ message: 'Products added successfully', products });
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to get all products
app.get('/products', (req, res) => {
    res.status(200).json(products);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
