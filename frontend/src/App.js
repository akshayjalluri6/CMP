import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import Login from './components/Login/Login';
import Sample from './components/Sample/Sample';

const App = () => (
  <BrowserRouter>
  <Routes>
    <Route exact path='/' Component={Sample} />
    <Route exact path='/login' Component={Login}/>
  </Routes>
  </BrowserRouter>
)
export default App