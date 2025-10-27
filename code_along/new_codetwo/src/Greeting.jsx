function Greeting(props) {
    return (
        <div>
            <h1>Hello, {props.name} </h1>
            <p>You are {props.age} years old.</p>
            <p>From {props.city}</p>
        </div>
    );
}

export default Greeting;