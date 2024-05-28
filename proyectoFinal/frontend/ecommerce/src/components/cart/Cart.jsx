import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const Cart = () => {
    const [loading, setLoading] = useState(true);
    const [cartData, setCartData] = useState([]);
    const [cid, setCid] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [productQuantities, setProductQuantities] = useState({});

    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        if (currentUser) {
            setCid(currentUser.carts[0]);
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/cart");
                if (response.status === 200) {
                    setCartData(response.data.payload.products);
                    const initialQuantities = {};
                    response.data.payload.products.forEach(product => {
                        initialQuantities[product.product._id] = product.quantity;
                    });
                    setProductQuantities(initialQuantities);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const updateQuantityInCart = async (cid, pid, quantity) => {
        try {
            await axios.put(`http://localhost:8080/api/carts/quantity/${cid}/product/${pid}`, { quantity });
        } catch (error) {
            console.error("Error updating quantity in cart:", error);
        }
    };

    const handlePurchaseCart = async () => {
        try {
            const validPositiveNumber = Object.values(productQuantities).every(quantity => quantity > 0);
            if (!validPositiveNumber) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Please enter valid quantities greater than zero for all products."
                });
                return;
            }

            const validQuantities = Object.entries(productQuantities).every(([pid, quantity]) => {
                const availableStock = cartData.find(product => product.product._id === pid)?.product.stock || 0;
                return quantity <= availableStock;
            });

            if (!validQuantities) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Please enter valid quantities for all products."
                });
                return;
            }

            const response = await axios.post(`http://localhost:8080/api/carts/purchase/${cid}`);
            if (response.status === 200) {
                const purchasedTicket = response.data.ticket;
                setTicket(purchasedTicket);
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: "Cart purchased successfully"
                });
            }
        } catch (error) {
            console.error("Error purchasing cart:", error);
            if (error.response && error.response.data && error.response.data.message) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unknown error occurred'
                });
            }
        }
    };

    const handleClearCart = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/carts/${cid}`);
            if (response.status === 200) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: "Cart cleared successfully"
                });
            }
            window.location.reload()
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    }

    const handleDeleteProductFromCart = async (pid) => {
        try {
            await axios.delete(`http://localhost:8080/api/carts/${cid}/product/${pid}`);
            window.location.reload()
        } catch (error) {
            console.error("Error clearing cart:", error);
            if (error.response && error.response.data && error.response.data.message) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unknown error occurred'
                });
            }
        }
    }

    const handleQuantityChange = (pid, event) => {
        const { value } = event.target;
        if (value > 0 || value === "") {
            setProductQuantities(prevQuantities => ({
                ...prevQuantities,
                [pid]: parseInt(value)
            }));
            updateQuantityInCart(cid, pid, parseInt(value));
        }
    }

    const handleQuantityIncrement = (pid) => {
        const updatedQuantity = (productQuantities[pid] || 0) + 1;
        setProductQuantities(prevQuantities => ({
            ...prevQuantities,
            [pid]: updatedQuantity
        }));
        updateQuantityInCart(cid, pid, updatedQuantity);
    };

    const handleQuantityDecrement = (pid) => {
        const updatedQuantity = Math.max((productQuantities[pid] || 0) - 1, 0);
        setProductQuantities(prevQuantities => ({
            ...prevQuantities,
            [pid]: updatedQuantity
        }));
        updateQuantityInCart(cid, pid, updatedQuantity);
    };

    if (loading) return <div>loading...</div>
    if (!currentUser) return <div>No user</div>;

    if (cartData.length <= 0) {
        return <div>No products in the cart</div>
    }

    if (ticket) {
        return (
            <div>
                <h3>Ticket info</h3>
                <p>Code: {ticket.code}</p>
                <p>Purchase Date: {ticket.purchase_datetime}</p>
                <p>Amount: ${ticket.amount}</p>
                <p>Purchaser: {ticket.purchaser}</p>
                <Link className="border" to={"/"}>Go back</Link>
            </div>
        );
    }

    return (
        <div className="xl:mx-80">
            <h2 className="title">Products:</h2>
            {
                cartData.map((product) => (
                    <div className="border my-4 flex flex-col justify-center items-center self-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 gap-8 rounded-lg border-gray-500" key={product._id}>
                        <p className="text-white text-lg font-bold">Title: {product.product.title}</p>
                        <p className="text-white text-lg">Price: ${product.product.price}</p>
                        <div className="flex">
                            <button className="button w-12 bg-slate-600 hover:bg-slate-700" onClick={() => handleQuantityDecrement(product.product._id)}>-</button>
                            <input
                                className="input text-center"
                                type="number"
                                value={productQuantities[product.product._id] || ''}
                                onChange={(event) => handleQuantityChange(product.product._id, event)}
                                min="1"
                            />
                            <button className="button w-12 bg-slate-600 hover:bg-slate-700" onClick={() => handleQuantityIncrement(product.product._id)}>+</button>
                        </div>
                        <p className="text-white text-lg">{product.product.stock} availables</p>
                        <button className="button my-2 w-6/12 bg-blue-600 hover:bg-blue-700" onClick={() => handleDeleteProductFromCart(product.product._id)}>remove product</button>
                    </div>
                ))
            }
            <button className="button my-2 bg-green-600 hover:bg-green-700" onClick={handlePurchaseCart}>Purchase Cart</button>
            <button className="button my-2" onClick={handleClearCart}>Clear Cart</button>
        </div>
    );
};
