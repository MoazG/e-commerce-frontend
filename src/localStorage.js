export function getDataLS() {
    let userData = JSON.parse(window.localStorage.getItem("data"));
    return userData
}
export function setDataLS(data) {
    window.localStorage.setItem("data", JSON.stringify(data));
}
