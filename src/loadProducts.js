import dataService from "./dataService.js";
import { getProduct } from "./getProductTemp.js";
import { getModal } from './getModalTemp.js';
import { modifyCartData } from "./cart.js";
import { addProductToCompare } from "./compareList.js";
import { getDataLS } from "./localStorage.js";
// import { getDataLS, setDataLS } from "./localStorage.js";
document.addEventListener("DOMContentLoaded", () => {
    let quickViewModal = document.querySelector(".quick_view_modal");
    // let cartContainer = document.querySelector()
    let modalSection = document.querySelector(".quick_view_modal .container")
    let outerContainer = document.querySelector(".product_container_outer")
    let productsContainer = document.createElement("div");
    let compareSection = document.querySelector(".compare_section");
    // let compareList = document.querySelector(".compare_list")
    productsContainer.classList.add("products_container_inner")
    outerContainer.appendChild(productsContainer)




    dataService.getAllProducts().then(data => {
        data.forEach(product => {
            // debugger;
            productsContainer.appendChild(getProduct(product))
        })
    });




    productsContainer.addEventListener("click", (e) => {
        let elm = e.target;
        if (elm.tagName == "A" && elm.classList == "btn") {
            modifyCartData(elm.dataset.pn)
        }
        else if (elm.closest("li") && elm.closest("li").classList[0] == "quick_view") {
            let elmId = e.target.closest("li").dataset.productId;
            dataService.getCustomProduct(`?id=${elmId}`).then(data => {
                modalSection.innerHTML = "";
                modalSection.appendChild(getModal(data[0]))
            })
                .then(() => {
                    let modalBtnContainer = document.querySelector(".product_modal_btn")
                    quickViewModal.style.display = "block"
                    setTimeout(() => {
                        quickViewModal.style.transform = "scale(1)"
                    }, 100)
                    modalBtnContainer.addEventListener("click", e => {
                        let qtyElm = modalBtnContainer.querySelector(".qty_num")
                        let currentQuantity = +qtyElm.innerHTML
                        if (e.target.classList == "inc") {
                            qtyElm.innerHTML = currentQuantity + 1;
                        }
                        else if (e.target.classList == "dec") {
                            currentQuantity > 1 ? qtyElm.innerHTML = currentQuantity - 1 : "";
                        }
                        else if (e.target.classList == "add_cart_btn") {
                            modifyCartData(e.target.dataset.pn, currentQuantity)
                        }
                    })
                })

        }
        else if (elm.closest("li") && elm.closest("li").classList[0] == "add_compare") {
            let elmId = e.target.closest("ul").dataset.productId;
            let { comparingList } = getDataLS()

            let checkprodExistance = comparingList.find(elm => elm.id == elmId)
            if (!checkprodExistance) {
                dataService.getCustomProduct(`/${elmId}`)
                    .then(data => {
                        addProductToCompare(data);

                    })
            }
            else {
                alert("product already exists in compare list")
            }
            compareSection.style.display = "block"

        };
    })


    // hide modal 
    quickViewModal.addEventListener("click", e => {
        let targetElm = e.target
        if (targetElm.classList[0] == "close" || targetElm.classList[0] == "quick_view_modal" || targetElm.classList[0] == "container") {
            quickViewModal.style.display = "none"
            quickViewModal.style.transform = "scale(0)"
        }
    })

    // add Event to compare list
    // compareSection.addEventListener("click", function (e) {
    //     if (e.target.classList.contains("hide")) {
    //         compareSection.style.display = "none"
    //     }
    //     if (e.target.classList.contains("clear")) {
    //         compareList.innerHTML = ""
    //         let userData = getDataLS()
    //         userData.comparingList = []
    //         setDataLS(userData)
    //         compareSection.style.display = "none"
    //     }
    //     if (e.target.classList.contains("compare")) {
    //         document.querySelector(".compare_modal_cont").style.display = "block";
    //         let { comparingList } = getDataLS();
    //         comparingList.forEach(({ id }) => {
    //             dataService.getCustomProduct(`/${id}`)
    //                 .then(data => addTableColumn(data))
    //         })
    //     }
    //     if (e.target.classList.contains("del_p")) {
    //         let productLi = e.target.closest("li");
    //         let userData = getDataLS();
    //         let productId = productLi.dataset.pn;
    //         userData.comparingList = userData.comparingList.filter(elm => elm.id != productId)
    //         productLi.remove();
    //         setDataLS(userData)
    //         if (userData.comparingList.length == 0) {
    //             compareSection.style.display = "none"
    //         }
    //     }
    //     if (e.target.classList.contains("remove_item")) {
    //         let { comparingList } = getDataLS();
    //         let productId = e.target.dataset.pn;
    //         // userData.comparingList = userData.comparingList.filter(elm => elm.id != productId)
    //         let itemsLabel = document.querySelectorAll(`.p_${productId}`)
    //         itemsLabel.forEach(elm => elm.remove())

    //         if (comparingList.length == 0) {
    //             document.querySelector(".compare_modal_cont").style.display = "none";
    //         }

    //     }
    //     if (e.target.classList.contains("compare_modal_cont")) {
    //         document.querySelector(".compare_modal_cont").style.display = "none";
    //     }
    // })

})
