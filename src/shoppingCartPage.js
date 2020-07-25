import dataService from "./dataService.js";
import { getDataLS, setDataLS } from "./localStorage.js";

document.addEventListener("DOMContentLoaded", () => {

    let tableBody = document.querySelector(".cart_table tbody");
    let tableBtns = document.querySelector(".cart_options");
    let cartTotalPrice = document.querySelector(".cart_total_price")
    let userData = getDataLS();



    // create item for shopping table
    function createTableRow(product, qty) {

        let productPrice = product.product_price * (100 - product.discount) / 100
        let tableRow = document.createElement("tr");
        tableRow.setAttribute("data-pn", `${product.id}`)
        let productTemp = `
        <td class="table_product_remove">
            <a href="javascript:void(0)" data-product-id=${product.id}><i class="fas fa-trash-alt"></i></a>
        </td>
        <td class="table_product_thumb">
            <img src=${product.product_img} alt="" />
        </td>
        <td class="table_product_name"><p>${product.productName}</p></td>
        <td class="table_product_price">
            <p>$
            ${productPrice}
            </p>
        </td>
        <td class="table_product_qty">
            <div class="qty">
                <div class="dec">&minus;</div>
                <div class="qty_num">${qty}</div>
                <div class="inc">&plus;</div>
            </div>
        </td>
        <td class="table_product_total_price"><span>$</span><p>${productPrice * qty}</p></td>
`
        tableRow.innerHTML = productTemp;
        return tableRow;
    }


    // itterate over cart to create new row for each product

    function setCartPage() {
        let { cart, totalPrice } = userData;

        if (cart.length == 0) {
            document.querySelector(".cart_table_cont").innerHTML = '<h2>Your Cart is emphty</h2>';
            return
        }
        cart.forEach(({ id, qty }) => {
            dataService.getCustomProduct(`/${id}`)
                .then(data => {

                    let newTableRow = createTableRow(data, qty)
                    tableBody.appendChild(newTableRow);

                })
        });
        cartTotalPrice.innerHTML = `$ ${totalPrice}`
    }

    setCartPage()
    let updatedItems = [];
    tableBody.addEventListener("click", (e) => {
        let productId = e.target.closest("tr").dataset.pn;

        if (e.target.tagName === "I") {

            let productPrice = +e.target.closest("tr").querySelector(".table_product_total_price p").innerText

            // let productId = e.target.parentElement.dataset.productId
            userData.cart = userData.cart.filter(product => product.id != productId)
            userData.totalPrice -= productPrice;
            // updatedItems = updatedItems.filter(elm => elm.id != productId)
            setDataLS(userData)
            window.location.reload()
        }
        let currentQtyElm = e.target.closest("td").querySelector(".qty_num")
        if (e.target.classList.contains("inc")) {
            dataService.getCustomProduct(`/${productId}`)
                .then(({ qty, product_price, discount }) => {
                    if (+currentQtyElm.innerText < qty) {
                        currentQtyElm.innerText = +currentQtyElm.innerText + 1;
                        let productPrice = product_price * (100 - discount) / 100
                        if (updatedItems.length > 0) {
                            let flag = 0;
                            updatedItems.forEach(product => {
                                if (product.id == productId) {
                                    product.qty = +currentQtyElm.innerText;
                                    product.increasedPrice += productPrice;
                                    flag++;
                                }
                            })
                            if (flag == 0) {
                                updatedItems.push({ id: +productId, qty: +currentQtyElm.innerText, increasedPrice: productPrice })
                            }
                        }
                        else {
                            updatedItems.push({ id: +productId, qty: +currentQtyElm.innerText, increasedPrice: productPrice })
                        }
                    }
                })
        }
        if (e.target.classList.contains("dec")) {
            if (+currentQtyElm.innerText > 1) {
                currentQtyElm.innerText = +currentQtyElm.innerText - 1;
                let productPrice = +e.target.closest("tr").querySelector(".table_product_price").innerText.split(" ")[1];

                if (updatedItems.length > 0) {
                    let flag = 0;
                    updatedItems.forEach(product => {
                        if (product.id == productId) {
                            product.qty = +currentQtyElm.innerText;
                            product.increasedPrice -= productPrice;
                            flag++;
                        }
                    })
                    if (flag == 0) {
                        updatedItems.push({ id: +productId, qty: +currentQtyElm.innerText, increasedPrice: -productPrice })
                    }
                }
                else {
                    updatedItems.push({ id: +productId, qty: +currentQtyElm.innerText, increasedPrice: -productPrice })
                }
            }
        }

    })

    // table foot Events
    tableBtns.addEventListener("click", (e) => {
        if (e.target.classList.contains("update_cart")) {
            updatedItems.forEach(product => {
                let prodIndex = userData.cart.findIndex(elm => elm.id == product.id)
                userData.cart[prodIndex].qty = product.qty;
                userData.totalPrice += product.increasedPrice;
            })
            setDataLS(userData);
            window.location.reload()
        }

        if (e.target.classList.contains("clear_cart")) {
            userData.cart = [];
            userData.totalPrice = 0;
            setDataLS(userData);
            window.location.reload()
        }
    })

})



