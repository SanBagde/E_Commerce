const express = require ('express');
const axios = require('axios');
const { Client } = require("pg");
const cors = require('cors');

const app = express();
const port = 4000;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "ecom",
  password: "Sanket@1303",
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

app.use(express.json());
app.use(cors());

app.get('/fetch-and-store', async (req, res) => {
  try {
    const response = await axios.get('https://dummyjson.com/products');
    const jsonData = response.data;
    
    for (const product of jsonData.products) {
      const query = `
        INSERT INTO products (title, description, price, category, images)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const values = [
        product.title,
        product.description,
        product.price,
        product.category,
        product.images,
      ];
      await client.query(query, values);
    }

    res.send('Data stored successfully!');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error storing data');
  }
});

app.get('/products', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
app.post('/add-to-cart', async (req, res) => {
  console.log(req.body);
  try {
    const { product_name, quantity, price, subtotal } = req.body;
    if (!product_name || !quantity || !price || !subtotal) {
      return res.status(400).send('Missing required fields');
    }
 
    // Check if the product already exists in the cart
    const existingCartItem = await client.query(
      'SELECT * FROM cart WHERE product_name = $1',
      [product_name]
    );
 
    if (existingCartItem.rows.length > 0) {
      return res.status(400).send('Product already exists in the cart');
    }
 
    const query = `
      INSERT INTO cart (product_name, quantity, price, subtotal)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [product_name, quantity, price, subtotal];
    await client.query(query, values);
    res.send('Product added to cart successfully!');
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).send('Error adding product to cart');
  }
});

// Route to get all products from cart
app.get('/cart', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM cart');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data from cart:', error);
    res.status(500).send('Error fetching data from cart');
  }
});

// Route to edit quantity and subtotal
app.put('/edit-cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, price } = req.body;
    const subtotal = quantity * price;
    const query = `
      UPDATE cart 
      SET quantity = $1, subtotal = $2
      WHERE id = $3
    `;
    const values = [quantity, subtotal, id];
    await client.query(query, values);
    res.send('Cart updated successfully!');
  } catch (error) {
    console.error('Error editing cart:', error);
    res.status(500).send('Error editing cart');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.get('/addToCart', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.get('/getAllCartItems', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM cart');
    console.log("Cart items", result.rows); // Ensure to access the rows property of the result
    res.send(result.rows); // Send the cart items back to the client
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});


app.delete('/deleteCartItem/:id', async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId)
  try {
    const result = await client.query("DELETE FROM cart WHERE id = $1", [itemId]);
    console.log(`Item with ID ${itemId} deleted from cart table`);
    res.send(`Item with ID ${itemId} deleted from cart table`);
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).send('Error deleting data');
  }
});
