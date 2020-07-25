
import { getDataLS, setDataLS } from "./localStorage.js";
import dataService from "./dataService.js";
import { getCartTemp } from "./getCartTemp.js"
export function setCartCounter({ cart }) {
    // itterate over the cart length to set the cart counter
    let totalQty = 0
    cart.forEach(product => {
        totalQty += product.qty
    })
    let cartsCounterList = document.querySelector(".cart-counter p")
    cartsCounterList.innerText = totalQty
    // cartsCounterList.forEach(elm => {
    // });
};
export function setCartPriceOnLoad({ totalPrice }) {
    let cartPriceElm = document.querySelector('.cart-total-price span');
    // cartPriceElms.forEach(elm => {  // itterate over the both cart (fixed-Nav & mid-Nav)
    //     elm.innerText = totalPrice
    // })
    cartPriceElm.innerText = totalPrice
}

export function setCartPrice({ product_price, discount }, qty = 1) {
    let cartPriceElms = document.querySelectorAll('.cart-total-price span');
    let userData = getDataLS(); // get user Data from local storage to get the total price
    let currentTotalPrice = userData.totalPrice
    let productPrice = product_price * (100 - discount) / 100;
    let newPrice = currentTotalPrice + (productPrice * qty);
    userData.totalPrice = newPrice; // set the new price in the userData
    setDataLS(userData); // set the new User Data in the local storage
    cartPriceElms.forEach(elm => {  // itterate over the both cart (fixed-Nav & mid-Nav)
        elm.innerText = newPrice
    })
    return newPrice;
}

export function modifyCartData(productId, qty = 1) {
    let userData = getDataLS()
    let checkProductExistance = userData.cart.findIndex(product => product.id == productId)
    dataService.getCustomProduct(`?id=${productId}`).then(data => {
        let TotalPrice = setCartPrice(data[0], qty);

        userData.totalPrice = TotalPrice;
        if (checkProductExistance == -1) { //check if the product doesn't exist then create it
            getCartTemp(data[0], qty);
            userData.cart.push({ id: productId, qty: qty })
        }
        else { // check if the product exist then modify the qty and price
            let productQty = userData.cart[checkProductExistance].qty + qty;
            userData.cart[checkProductExistance].qty = productQty;
            // let productInfoElm = document.querySelectorAll(`.cart_product_info_${userData.cart[checkProductExistance].id}`);
            // productInfoElm.forEach(elm => {
            //     let currentQty = +(elm.children[1].children[0].innerHTML);
            //     elm.children[1].children[0].innerHTML = productQty;
            // })
            let productInfoElm = document.querySelector(`.cart_product_info_${userData.cart[checkProductExistance].id}`);
            productInfoElm.children[1].children[0].innerHTML = productQty;
        }

    }).then(() => {
        setDataLS(userData);
        setCartCounter(userData)
    })
}
