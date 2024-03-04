import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Fetchdata.css";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context";

function Fetchdata() {
  const [data, setData] = useState([]);
  const [currentFilteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [acart, setaCart] = useState([]);
  const {
    state: { cart },
    dispatch,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios 
      .get("http://localhost:4000/products")
      .then((response) => {
        console.log(response);
        setData(response.data);
        const uniqueCategories = Array.from(
          new Set(response.data.map((product) => product.category))
        );
        setCategories(["All", ...uniqueCategories]);
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const addToCart1 = (value) => {
    // console.log("Value - >>>>>>>>>>. ", value);
    console.log("Data =-- >.....");
    console.log("Data type ->........ ", typeof value.q);
    const requestData = {
      product_name: value.title, // Replace with actual product name
      quantity: 1, // Replace with actual quantity
      price: value.price, // Replace with actual price
      subtotal: value.price, // Replace with actual subtotal
    };
    console.log(requestData);

    axios
      .post("http://localhost:4000/add-to-cart", requestData)
      .then((response) => {
        console.log(response.data);
        // Handle response if needed
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  const handleDiffToast = () => {
    toast.info({
      position: "top-center",
    });
  };

  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((product) => product.category === category);
      setFilteredData(filtered);
      console.log(category);
    }
  };

  const Cart = () => {
    navigate("/Cart");
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      toast.warning(`${product.title} is already in the cart`, {
        position: "top-center",
      });
    } else {
      dispatch({
        type: "ADD_TO_CART",
        payload: {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
        },
      });

      const newItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        // subtotal:product.price,
      };
      setaCart([...cart, newItem]);
      toast.success(`${product.title} Item added in cart`, {
        position: "top-center",
      });
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const updateCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setaCart(updateCart);
  };

  const filteredData =
    selectedCategory == "All"
      ? data
      : data.filter((product) => product.category === selectedCategory);


      return (
        <>
          <ToastContainer />
          <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">
                Select :
              </a>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <select
                      id="categoryFilter"
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => handleFilter(e.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </li>
                </ul>
                <button className="btn btn-primary me-2" onClick={Cart} data-testid="viewcart">
                  <FaShoppingCart className="me-2" /> View cart
                </button>
              </div>
            </div>
          </nav>
          <div className="container my-2">
            <div className="row">
              {filteredData.map((value) => (
                <div className="col-4" key={value.id} style={{ padding: "10px" }}>
                  <div className="card" style={{ width: "80%", height: "100%" }} data-testid="product-card">
                    <img src={value.images[0]} className="card-img-top" alt={value.images} style={{ width: "100%", height: "60%" }} />
                    <div className="card-body">
                      <h5 className="card-title" data-testid="product-title">
                        {value.title}
                      </h5>
                      <p className="card-text" data-testid="product-description">
                        {value.description}
                      </p>
                      <p className="card-text">
                        <strong>Price:</strong> ₹{value.price}
                      </p>
                      <p className="card-text">
                        <strong>Categories:</strong> {value.category}
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          handleAddToCart(value);
                          addToCart1(value);
                          handleDiffToast();
                        }}
                      >
                        <FaShoppingCart className="me-2" /> Add to Cart
                      </button>
                      {cart > 0 && (
                        <Cart
                          updateQuantity={updateQuantity}
                          data-testid="cart-component"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

//   return (
//     <>
//       <ToastContainer />
       
//       <div className='container my-2'>
//   <div className='row align-items-center'>
//     <div className='col-1'>
//       <label htmlFor='categoryFilter' className='form-label'><strong><h4>Filter :</h4></strong></label>
//     </div>
//     <div className='col-2'>
//       <select id='categoryFilter' className='form-select' value={selectedCategory} onChange={(e) => handleFilter(e.target.value)}>
//         {categories.map((category) => (
//           <option key={category} value={category}>{category}</option>
//         ))}
//       </select>  
//     </div>
//     <div className='col-9 d-flex justify-content-end'>
//       <button className='btn btn-primary me-2' onClick={Cart} data-testid="viewcart">
//         <FaShoppingCart className='me-2' />View cart
//       </button>
//     </div>

//           <div className="container my-5">
//             <div className="row">
//               {filteredData.map((value) => (
//                 <div
//                   className="col-4"
//                   key={value.id}
//                   style={{ padding: "10px" }}
//                 >
//                   <div
//                     className="card"
//                     style={{ width: "80%", height: "100%" }}
//                     data-testid="product-card"
//                   >
//                     <img
//                       src={value.images[0]}
//                       className="card-img-top"
//                       alt={value.images}
//                       style={{ width: "100%", height: "60%" }}
//                     />
//                     <div className="card-body">
//                       <h5 className="card-title" data-testid="product-title">
//                         {value.title}
//                       </h5>
//                       <p
//                         className="card-text"
//                         data-testid="product-description"
//                       >
//                         {value.description}
//                       </p>
//                       <p className="card-text">
//                         <strong>Price:</strong> ₹{value.price}
//                       </p>
//                       <p className="card-text">
//                         <strong>Categories:</strong> {value.category}
//                       </p>

//                       <button
//                         className="btn btn-primary"
//                         onClick={(e) => {
//                           handleAddToCart(value);
//                           addToCart1(value);
//                           handleDiffToast();
//                         }}
//                       >
//                         <FaShoppingCart className="me-2" /> Add to Cart
//                       </button>
//                       {cart > 0 && (
//                         <Cart
//                           updateQuantity={updateQuantity}
//                           data-testid="cart-component"
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

export default Fetchdata;
