function GreetingCard({ name, message, color = "lightblue" }) {
  const cardStyle = {
    backgroundColor: color,
    padding: "20px",
    margin: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  return (
    <div style={cardStyle}>
      <h2>Hello, {name}!</h2>
      <p>{message}</p>
    </div>
  );
}

export default GreetingCard;