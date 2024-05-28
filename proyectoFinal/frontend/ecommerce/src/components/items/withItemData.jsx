import { useEffect, useState } from "react";
import axios from 'axios';

export const withItemData = (Component) => {

    const WithItemData = (props) => {
        const [loading, setLoading] = useState(true)
        const [itemData, setItemData] = useState([]);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get("http://localhost:8080/api/products");

                    if (response.status === 200) {
                        setItemData(response.data.payload.docs);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false)
                }
            };

            fetchData();
        }, []);

        return <Component {...props} loading={loading} itemData={itemData} />
    }

    return WithItemData
};
