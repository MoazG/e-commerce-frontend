import { setDataLS, getDataLS } from "./localStorage.js";
import dataService from "./dataService.js"
import { setCartCounter, setCartPriceOnLoad } from "./cart.js"
import { getCartTemp } from "./getCartTemp.js";
import { getSearchProductTemp } from "./getSearchProductTemp.js"
import { loadProductInCompare, addTableColumn } from "./compareList.js";
document.addEventListener("DOMContentLoaded", function () {

    let userName = document.querySelector(".login_name a");
    let logOutBtn = document.querySelector(".log_out");
    let toTop = document.querySelector(".to_top")
    let categoriesList = document.querySelector(".categories");
    let hiddenCatList = document.querySelector(".categories-list-container");
    let midNav = document.querySelector(".mid-nav-cont")
    let searchInput = document.querySelector(".search-input");
    let searchResult = document.querySelector(".search_results");
    let searchResultContainer = document.querySelector(".search_results ul");
    let compareSection = document.querySelector(".compare_section");
    let compareList = document.querySelector(".compare_list")
    let openCompareList = document.querySelector(".open_compare");
    let userData = {
        userId: 0,
        userName: "",
        cart: [],
        totalPrice: 0,
        wishingList: [],
        comparingList: []
    }


    // first on load the page if (there is no localStorage )
    if (!getDataLS()) {
        setDataLS(userData)
    }
    else {
        userData = getDataLS()
        setCartCounter(userData);
        setCartPriceOnLoad(userData)
        if (userData.userId !== 0) {
            userName.innerHTML = `Welcome: ${userData.userName}`
            userName.setAttribute("href", "javascript:void(0)")
            logOutBtn.style.display = "block"
        }
        else {
            logOutBtn.style.display = "none"
        }
        userData.cart.forEach(elm => {
            dataService.getCustomProduct(`?id=${elm.id}`).then(data => {
                getCartTemp(data[0], elm.qty)
            })
        })
        loadProductInCompare()
    }
    // logout
    logOutBtn.addEventListener("click", function (e) {
        e.preventDefault()

        let userData = getDataLS();
        if (userData.userId !== 0) {
            fetch(`http://localhost:3001/users/${userData.userId}`, {
                method: "PATCH",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify({ cart: userData })
            }).then(response => response.json())
                .then(() => {
                    // console.log(data)
                    window.localStorage.clear();
                    location.reload()
                })
        }
        else return

    })


    function debounce(cb, time) {
        let intervals;
        return function (e) {
            clearInterval(intervals);
            intervals = setTimeout(() => {
                cb(e)
            }, time)
        }

    }
    // search butoon
    function search(e) {
        let searchTerm = e.target.value;
        dataService.getCustomProduct(`?productName_like=${searchTerm}&_limit=8`)
            .then(data => {
                searchResult.classList.remove("hide")
                searchResultContainer.innerHTML = ""
                data.forEach(product => {
                    searchResultContainer.appendChild(getSearchProductTemp(product))
                })
            })
            .then(() => {
                if (searchTerm.length < 1) {
                    searchResult.classList.add("hide")
                }
                document.querySelector("body").addEventListener("click", (e) => {
                    if (e.target.tagName !== "UL") {
                        searchResult.classList.add("hide")
                    }
                })
            })

    }
    searchInput.addEventListener("input", debounce(search, 500))

    // show the ctegory list
    categoriesList.addEventListener("click", () => {

        hiddenCatList.classList.toggle("show_cat_list")
    })
    // change the mid-nav and to-top-btn position
    window.addEventListener("scroll", () => {
        midNav.classList.toggle("sticky", window.scrollY > 100)
        toTop.classList.toggle("to_top_visible", window.scrollY > 300)
    })

    // show comparing list from account options
    openCompareList.addEventListener("click", () => {
        compareSection.style.display = "block";
    })
    // add Event to compare list
    compareSection.addEventListener("click", function (e) {
        if (e.target.classList.contains("hide")) {
            compareSection.style.display = "none";
            return
        }
        if (e.target.classList.contains("clear")) {
            compareList.innerHTML = ""
            let userData = getDataLS()
            userData.comparingList = []
            setDataLS(userData)
            compareSection.style.display = "none";
            return;
        }
        if (e.target.classList.contains("compare")) {
            let { comparingList } = getDataLS();
            if (comparingList.length == 0) {
                alert("There is no item to compare")
                return
            }
            document.querySelector(".compare_modal_cont").style.display = "block";
            comparingList.forEach(({ id }) => {
                dataService.getCustomProduct(`/${id}`)
                    .then(data => addTableColumn(data))
            })
            return
        }
        if (e.target.classList.contains("del_p")) {
            let productLi = e.target.closest("li");
            let userData = getDataLS();
            let productId = productLi.dataset.pn;
            userData.comparingList = userData.comparingList.filter(elm => elm.id != productId)
            productLi.remove();
            setDataLS(userData)
            if (userData.comparingList.length == 0) {
                compareSection.style.display = "none"
            }
            return
        }
        if (e.target.classList.contains("remove_item")) {
            let userData = getDataLS();

            let productId = e.target.dataset.pn;
            userData.comparingList = userData.comparingList.filter(elm => elm.id != productId)

            let itemsLabel = document.querySelectorAll(`.p_${productId}`)
            itemsLabel.forEach(elm => elm.remove())
            setDataLS(userData)
            if (userData.comparingList.length == 0) {
                document.querySelector(".compare_modal_cont").style.display = "none";
            }
            return
        }
        if (e.target.classList.contains("compare_modal_cont")) {
            document.querySelector(".compare_modal_cont").style.display = "none";
        }
    })


})
