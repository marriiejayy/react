import './App.css';

function ProductCard({ name, price, image, inStock }) {
  return (
    <div className="product-card">
      <div className={`image-container ${!inStock ? 'out-of-stock' : ''}`}>
        <img src={image} alt={name} />
        {!inStock && <div className="overlay">Out of Stock</div>}
      </div>
      <h3>{name}</h3>
      <p>₦{price}</p>
      <p className={inStock ? 'in-stock' : 'out-of-stock-text'}>
        {inStock ? 'In Stock ✓' : 'Out of Stock'}
      </p>
    </div>
  );
}

export default ProductCard;