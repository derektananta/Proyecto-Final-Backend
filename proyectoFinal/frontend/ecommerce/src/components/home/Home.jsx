import { Link } from "react-router-dom"

export const Home = () => {
    return (
        <div className="xl:mx-80">
            <h1 className="title">Ecommerce API</h1>
            <h2 className="title">Routes</h2>
            <div className="flex flex-col gap-4">
                <Link to="/register" className="border-gray-600 bg-gray-400 hover:bg-gray-500 input text-2xl font-bold">Register</Link>
                <Link to="/login" className="border-gray-600 bg-gray-400 hover:bg-gray-500 input text-2xl font-bold">Login</Link>
                <div>
                    <Link to="/profile" className="border-gray-600 bg-gray-400 hover:bg-gray-500 input text-2xl font-bold">Profile</Link>
                    <p>*Para acceder aquí primero debes loguearte</p>
                </div>
                <Link to="/admin" className="border-gray-600 bg-gray-400 hover:bg-gray-500 input text-2xl font-bold">Products</Link>
                <div>
                    <Link to="/cart" className="border-gray-600 bg-gray-400 hover:bg-gray-500 input text-2xl font-bold">Cart</Link>
                    <p>*Para acceder aquí primero debes loguearte</p>
                </div>
                <div>
                    <Link to="/admin" className="border-gray-600 bg-gray-400 hover:bg-gray-500 input text-2xl font-bold">Admin</Link>
                    <p>*Para acceder aquí debes loguearte con un usuario de role "admin"</p>
                </div>
            </div>
        </div>
    )
}