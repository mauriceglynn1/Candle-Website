import './App.css'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import {Home} from './Pages/Home'
import {Login} from './Pages/Login'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>

      </Routes>
    </Router>
  );
}

export default App
