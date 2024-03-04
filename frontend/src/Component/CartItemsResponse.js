import React,{useState} from "react";

const [cartItems, setCartItems] = useState([]);

const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:4000/getAllCartItems');
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };
  export default cartItems;