import { serverApi } from "../../config/baseApi";

export const createOrderItem = async (token, data) => {
    try {
        const response = await fetch(serverApi + '/order-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        return response.json();
    } catch (err) {
        console.log(err)
    }
}

export const checkOrderItem = async (token, data) => {
    try {
        const response = await fetch(serverApi + '/check-order-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        return response.json();
    } catch (err) {
        console.log(err)
    }
}