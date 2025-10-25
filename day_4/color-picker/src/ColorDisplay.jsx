function ColorDisplay({ red, green, blue, hex }) {
    const colorStyle = {
        width: '3050px',
        height: '600px',
        border: 'none',
        backgroundColor: `rgb(${red}, ${green}, ${blue})`,
        border: '2px solid black',
        margin: '10px',
        padding:'10px'
    };

    function handleCopyHex() {
        navigator.clipboard.writeText(hex);
        alert(`Copied ${hex} to clipboard!`);
    }

    return (
        <div>
            <div className="rgb-hex">
                <p>RGB: ({red}, {green}, {blue})</p>
                <p>HEX: {hex}</p>
            </div>

            <div
                style={colorStyle}>
            </div>
            <button onClick={handleCopyHex}>Copy Hex</button>
        </div>
    );
}

export default ColorDisplay;