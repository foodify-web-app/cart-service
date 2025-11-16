import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const user_service_url = process.env['user-service'];
const dish_service_url = process.env['dish-service'];
// add item to user cart
const addToCart = async (req, res) => {
  try {
    let cartData = {};
    try {
      let userData = await axios.get(`${user_service_url}/${req.body.userId}`, { headers: { 'token': req.headers.token } });
      cartData = userData.data.data.cartData;
    } catch (error) {
      return res.json({ success: false, message: "User not found", error: error.message });
    }

    try {
      const dish = await axios.get(`${dish_service_url}/${req.body.itemId}`);
      if (dish == null) {
        return res.json({ success: false, message: "Dish not found" });
      }
    } catch (error) {
      return res.json({ success: false, message: "Dish not found", error: error.message });
    }

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await axios.put(`${user_service_url}/update/${req.body.userId}`, { cartData }, { headers: { 'token': req.headers.token } });
    return res.json({ success: true, message: "Added to Cart" });

  } catch (error) {
    return res.json({ success: false, message: "Error to add to cart", error: error.message });
  }
};

// remove items from user cart

const removeFromCart = async (req, res) => {
  try {
    let userData = await axios.get(`${user_service_url}/${req.body.userId}`, { headers: { 'token': req.headers.token } });
    let cartData = await userData.data.data.cartData;

    const dish = await axios.get(`${dish_service_url}/${req.body.itemId}`);
    
    if (dish == null) {
      return res.json({ success: false, message: "Dish not found" });
    }

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    await axios.put(`${user_service_url}/update/${req.body.userId}`, { cartData }, { headers: { 'token': req.headers.token } });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetch user cart data

const getCartByUserId = async (req, res) => {
  try {
    let userData = await axios.get(`${user_service_url}/${req.params.id}`, { headers: { 'token': req.headers.token } });
    let cartData = await userData.data.data.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    res.json({ success: false, message: "Error to fetch cart data", error: error.message });
  }
};

const getItemsListByUserId = async (req, res) => {
  try {
    let userData = await axios.get(`${user_service_url}/${req.params.id}`, { headers: { 'token': req.headers.token } });
    let cartData = await userData.data.data.cartData;

    const newArray = await Promise.all(
      Object.entries(cartData).map(async ([key, value]) => {
        console.log(value)
        if (value == 0) return {}; // Handle zero quantity case
        const dish = await axios.get(`${dish_service_url}/${key}`);
        
        if (dish == null) return {};
        return {
          ...dish.data.data, // Ensure dish is converted to a plain object
          quantity: value,
        };
      })
    );

    res.json({ success: true, newArray });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCartByUserId, getItemsListByUserId };


