import { serverApi } from "../../config/baseApi";

export const createOrder = async (token, data) => {
    try {
        const response = await fetch(serverApi + '/order', {
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

export const updateOrder = async (token, data, id) => {
    try {
        const response = await fetch(serverApi + '/order/' + id, {
            method: 'PUT',
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

export const checkPendingOrder = async (token) => {
    try {
        const response = await fetch(serverApi + '/order-pending', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        return response.json();
    } catch (err) {
        console.log(err)
    }
}


export const confirmationOrder = async (token, id) => {
    try {
        const response = await fetch(serverApi + '/order-confirmation/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        return response.json();
    } catch (err) {
        console.log(err)
    }
}

export const getOrder = async (token) => {
    try {
        const response = await fetch(serverApi + '/order', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        return response.json();
    } catch (err) {
        console.log(err)
    }
}

export const detailOrder = async (token, id) => {
    try {
        const response = await fetch(serverApi + '/order/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        return response.json();
    } catch (err) {
        console.log(err)
    }
}