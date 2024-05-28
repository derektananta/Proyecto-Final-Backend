import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { ItemList } from './components/items/ItemList.jsx'
import { Register } from './components/users/Register.jsx'
import { Login } from './components/users/Login.jsx'
import { Profile } from './components/users/Profile.jsx'
import { Cart } from './components/cart/Cart.jsx'
import { UserContextProvider } from './components/context/UserContext.jsx'
import { Admin } from './components/admin/Admin.jsx'
import { Home } from './components/home/Home.jsx'

function App() {

  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<Navigate to={"/"} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/products' element={<ItemList />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
