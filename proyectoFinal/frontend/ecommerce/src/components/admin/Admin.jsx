import axios from "axios";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx"

export const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const { currentUser } = useContext(UserContext)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users");
                if (response.status === 200) {
                    setUserData(response.data.payload);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentUser]);

    const handleDeleteUser = async (email) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/users/email/${email}`);
            if (response.status === 200) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: "User deleted successfully"
                });
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
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

    const handleUpdateUserRole = async (email, role) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/users/role/${email}`, { role });
            if (response.status === 200) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: "User role updated successfully"
                });
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating user role:", error);
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

    if (loading) return <div>loading...</div>;
    if (!currentUser || (currentUser && currentUser.role !== "admin")) return <div>Cannot view this</div>;
    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:mx-80">
            <h2 className="title">Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {userData.map((user) => (
                    <div key={user.email} className=" m-4 flex flex-col border rounded-lg overflow-hidden bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-4">
                            <div className="flex flex-col sm:border-l col-span-3">
                                <div className="flex flex-col space-y-4 p-6 text-gray-600">
                                    <div className="flex flex-row text-sm">
                                        <p className="flex items-center text-gray-500 text-lg">
                                            <span className="font-semibold mr-2 text-lg uppercase">Name:</span>
                                            <span className="capitalize">{user.name}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-row text-sm">
                                        <p className="flex items-center text-gray-500 text-lg">
                                            <span className="font-semibold mr-2 text-lg uppercase">Email:</span>
                                            <span>{user.email}</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-row text-sm">
                                        <p className="flex items-center text-gray-500 text-lg">
                                            <span className="font-semibold mr-2 text-lg uppercase">Role:</span>
                                            <span className="capitalize">{user.role}</span>
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center justify-center gap-4 mx-4">
                                    <button className="button h-24 w-36 bg-gray-500 hover:bg-gray-800" onClick={() => handleUpdateUserRole(user.email, "admin")}>Change role to Admin</button>
                                    <button className="button h-24 w-36 bg-gray-500 hover:bg-gray-800" onClick={() => handleUpdateUserRole(user.email, "premium")}>Change role to Premium</button>
                                    <button className="button h-24 w-36 bg-gray-500 hover:bg-gray-800" onClick={() => handleUpdateUserRole(user.email, "user")}>Change role to User</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col border-b sm:border-b-0 items-center p-8 sm:px-4 sm:h-full sm:justify-center">
                            <button className="button" onClick={() => handleDeleteUser(user.email)}>Delete user</button>
                        </div>
                    </div>


                ))}
            </div>
        </div>
    );
};
