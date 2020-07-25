const URL = "http://localhost:3001"
export default {
    productRequest: {
        get: (params) => {
            if (params) {
                return fetch(`${URL}/products${params}`, { method: "GET" })
                    .then(response => response.json())
            }
            else {
                return fetch(`${URL}/products`, { method: "GET" }).then(respone => respone.json())
            }

        }
    },
    userRequest: {
        get: (params) => {
            return fetch(`${URL}/users${params}`, { method: "GET", })
                .then(response => response.json())
        },
        post: (name, email, pw) => {
            return fetch(`${URL}/users`, {
                method: "POST",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: pw

                })
            })
                .then(response => response.json())
        }

    }

}
