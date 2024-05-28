import { useContext, useEffect, useState } from "react"
import axios from "axios";
import Swal from "sweetalert2"
import { UserContext } from "../context/UserContext";

export const Profile = () => {
    const { currentUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/profile");

                if (response.status === 200) {
                    setUserData(response.data.payload);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/users/logout");
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "Logout success"
            });
            window.location.replace("/login")
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!currentUser) return <div>No user</div>;

    return (
        <div className='xl:mx-80'>
            <h2 className="title">User profile</h2>
            <p className="input capitalize"><strong>Name:</strong> {userData.name}</p>
            <p className="input"><strong>Email:</strong> {userData.email}</p>
            <p className="input capitalize"><strong>Role:</strong> {userData.role}</p>
            <button className="button my-4" onClick={handleLogout}>Logout</button>
        </div>
    )
}
