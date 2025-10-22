// // import { useState } from 'react'
//  import Greeting from "./Card";

// import './App.css'

// function App() {
//     return (
//         <div>
//             <Greeting name="Tunde" email={25} location="Lagos" />
//             <Greeting name="Sade" email={25} location="Kano" />
//         </div>
//     );
// }
// export default App

import Card from "./Card"
import "./App.css"

function App(){
  return (
    <div>
      <Card>
        <h2>Lagos tech meetup</h2>
        <p>join us this saturday</p>
      </Card>
    </div>
  )
}