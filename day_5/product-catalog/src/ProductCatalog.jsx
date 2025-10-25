import { useState } from 'react';
import './ProductCatalog.css';

function ProductCatalog() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const products = [
    { id: 1, name: 'Laptop', price: 450000, inStock: true, category: 'Electronics' },
    { id: 2, name: 'Smartphone', price: 150000, inStock: false, category: 'Electronics' },
    { id: 3, name: 'Jollof Rice', price: 1500, inStock: true, category: 'Food' },
    { id: 4, name: 'T-Shirt', price: 5000, inStock: true, category: 'Clothing' },
    { id: 5, name: 'Headphones', price: 25000, inStock: true, category: 'Electronics' },
    { id: 6, name: 'Pounded Yam', price: 2000, inStock: false, category: 'Food' },
    { id: 7, name: 'Jeans', price: 8000, inStock: true, category: 'Clothing' },
    { id: 8, name: 'Tablet', price: 120000, inStock: true, category: 'Electronics' },
  ];


  let filteredProducts = products;
  if (categoryFilter !== 'all') {
    filteredProducts = products.filter(product => product.category === categoryFilter);
  }


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="product-catalog">
      <h1>Product Catalog</h1>
      <div className="filters">
        <span>Filter: </span>
        <button 
          className={categoryFilter === 'all' ? 'active' : ''}
          onClick={() => setCategoryFilter('all')}
        >
          All
        </button>
        <button 
          className={categoryFilter === 'Electronics' ? 'active' : ''}
          onClick={() => setCategoryFilter('Electronics')}
        >
          Electronics
        </button>
        <button 
          className={categoryFilter === 'Clothing' ? 'active' : ''}
          onClick={() => setCategoryFilter('Clothing')}
        >
          Clothing
        </button>
        <button 
          className={categoryFilter === 'Food' ? 'active' : ''}
          onClick={() => setCategoryFilter('Food')}
        >
          Food
        </button>
      </div>

      
      <div className="sort">
        <span>Sort by: </span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      
      <div className="products">
        {sortedProducts.map(product => (
          <div key={product.id} className="product">
            <h3>{product.name}</h3>
            <p className="price">₦{product.price.toLocaleString()}</p>
            <p className="category">{product.category}</p>
            
            {product.inStock ? (
              <button className="add-btn">Add to Cart</button>
            ) : (
              <div>
                <p className="out-of-stock">Out of Stock</p>
                <button className="notify-btn" disabled>Notify Me</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <p className="no-products">No products found.</p>
      )}
    </div>
  );
}

export default ProductCatalog;