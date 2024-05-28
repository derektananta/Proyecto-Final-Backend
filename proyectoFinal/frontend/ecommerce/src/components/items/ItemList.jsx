import { useState, useEffect } from "react";
import { withItemData } from "./withItemData";
import axios from "axios";
import Swal from "sweetalert2";

export const ItemList = withItemData(({ loading, itemData }) => {
    const [cid, setCid] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/current");
                if (response.status === 200) {
                    setCid(response.data.payload.carts[0]);
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    const handleAddItem = async (pid) => {
        try {
            await axios.post(`http://localhost:8080/api/carts/${cid}/product/${pid}`);
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "Product added in cart successfully"
            });
        } catch (error) {
            console.error("Error adding product to cart:", error);
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

    if (loading) return <div>Loading...</div>;
    return (
        <div className='xl:mx-80'>
            <h1 className="title">Products List</h1>
            <div className="grid grid-cols-2 gap-4">
                {
                    itemData.map((item) => (
                        <div className="flex flex-col border items-center p-4 justify-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 gap-8 rounded-lg border-purple-500" key={item._id}>
                            <p className="text-lg text-center font-semibold text-white">{item.title}</p>
                            <p className="text-xl font-bold  text-white ">{item.price}</p>
                            <button className="button bg-transparent  border-purple-500 px-1 my-4 hover:bg-purple-500" onClick={() => handleAddItem(item._id)}>Add in cart</button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
});
