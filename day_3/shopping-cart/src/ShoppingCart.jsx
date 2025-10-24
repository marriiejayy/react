import { useState } from 'react';
import './ShoppingCart.css';

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Jollof Rice', price: 1500, quantity: 2 },
    { id: 2, name: 'Plantain', price: 500, quantity: 1 },
    { id: 3, name: 'Suya', price: 1200, quantity: 1 }
  ]);
  
  function increaseQuantity(id) {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  }
  
  function decreaseQuantity(id) {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    ));
  }
  
  function removeItem(id) {
    setCartItems(cartItems.filter(item => item.id !== id));
  }
  
  function clearCart() {
    setCartItems([]);
  }
  
  function calculateTotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  function formatPrice(price) {
    return `₦${price.toLocaleString()}`;
  }
  
  return (
    <div className="shopping-cart">
      <h2>🛒 Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-price">{formatPrice(item.price)} × {item.quantity}</span>
                <span className="item-subtotal">
                  = {formatPrice(item.price * item.quantity)}
                </span>
              </div>
              <div className="item-actions">
                <button onClick={() => decreaseQuantity(item.id)} className="btn-quantity">-</button>
                <button onClick={() => increaseQuantity(item.id)} className="btn-quantity">+</button>
                <button onClick={() => removeItem(item.id)} className="btn-remove">Remove</button>
              </div>
            </div>
          ))}
          
          <div className="cart-total">
            <strong>Total: {formatPrice(calculateTotal())}</strong>
          </div>
          
          <button onClick={clearCart} className="btn-clear">
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;