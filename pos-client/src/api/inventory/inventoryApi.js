
import { serverApi } from "../../config/baseApi"

export const getInventory = async (token) => {
    try {
        const response = await fetch(serverApi + '/inventory', {
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

export const createInventory = async (token, data) => {
    try {
        const response = await fetch(serverApi + '/inventory', {
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

export const updateInventory = async (token, data, id) => {
    try {
        const response = await fetch(serverApi + '/inventory/' + id, {
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