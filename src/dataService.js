import Api from "./api.js"
export default {
    getAllProducts: () => {
        return Api.productRequest.get()
    },
    getCustomProduct: (params) => {
        return Api.productRequest.get(params)
    },
    getUser: (params) => {
        return Api.userRequest.get(params)
    },
    registerUser: (name, email, pw) => {
        return Api.userRequest.post(name, email, pw)
    }
}
