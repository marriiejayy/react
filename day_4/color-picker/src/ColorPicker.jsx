import { useState } from 'react';
import RGBSlider from './RGBSlider';
import ColorDisplay from './ColorDisplay';

function ColorPicker() {
    const [red, setRed] = useState(255);
    const [green, setGreen] = useState(100);
    const [blue, setBlue] = useState(50);

    const hex = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;

    return (
        <div className='color-picker'>
            <h1>🎨 Color Picker</h1>
            <div className='rgb-slider'>
                <RGBSlider
                    color="Red"
                    value={red}
                    onChange={setRed}
                />
                <RGBSlider
                    color="Green"
                    value={green}
                    onChange={setGreen}
                />
                <RGBSlider
                    color="Blue"
                    value={blue}
                    onChange={setBlue}
                />
            </div>

            <div className='color-display'>
                <ColorDisplay
                    red={red}
                    green={green}
                    blue={blue}
                    hex={hex}
                />

            </div>
        </div>
    );
}

export default ColorPicker;