import { serverApi } from "../../config/baseApi"

export const loginApi = async (data) => {
    try {
        const response = await fetch(serverApi + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return response.json();
    } catch (err) {

    }
}