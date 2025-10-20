import ProductCard from './ProductCard';

function App() {
  return (
    <div>
      <ProductCard 
        name="Laptop(HP, Macbook, DELL)" 
        price="450,000 - 900,000" 
        image="https://cdn.thewirecutter.com/wp-content/media/2024/07/laptopstopicpage-2048px-3685-2x1-1.jpg?width=1024&quality=75&crop=2:1&auto=webp" 
        inStock={true} 
      />
      <ProductCard 
        name="iPnone 12" 
        price="385,000 - 521,550" 
        image="https://applepremiumstore.com.ng/wp-content/uploads/2021/07/iphone11-select-2019-family-510x612.jpeg" 
        inStock={false} 
      />
      <ProductCard 
        name="Headphones" 
        price="25,000" 
        image="https://www.rollingstone.com/wp-content/uploads/2025/04/Untitled-13.png?w=900&h=600&crop=1" 
        inStock={true} 
      />
    </div>
  );
}

export default App;