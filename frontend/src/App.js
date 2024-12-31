import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Manager from './components/Manager/manager';
import Supervisor from './components/Supervisor/supervisor';

const App = () => (
  <BrowserRouter>
  <Routes>
    <Route exact path='/' Component={Home} />
    <Route exact path='/login' Component={Login}/>
    <Route exact path = '/manager' Component={Manager} />
    <Route exact path='/supervisor' Component={Supervisor} />
  </Routes>
  </BrowserRouter>
)
export default App