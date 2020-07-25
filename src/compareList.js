import { setDataLS, getDataLS } from "./localStorage.js";
import dataService from "./dataService.js";

function getCompareItem(product) {
    let itemLi = document.createElement("li")
    itemLi.classList.add("compare_item");
    itemLi.setAttribute("data-pn", `${product.id}`)
    let productTemp = `
        <div class="compare_product">
            <div class="compare_img">
                <img src=${product.product_img} alt="" />
            </div>
            <div class="compare_title">
                <h3>${product.productName}</h3>
            </div>
            <div class="compare_delete">
                <a class="close del_p" href="javascript:void(0);">&times;</a>
            </div>
        </div>
    `
    itemLi.innerHTML = productTemp;

    return itemLi
}
function gettableColumn(product) {
    let pAction = document.createElement("td")
    let pTitle = document.createElement("td")
    let pImage = document.createElement("td")
    let pPrice = document.createElement("td")
    let pDescription = document.createElement("td")
    pAction.innerHTML = `<a class="close remove_item" data-pn=${product.id} >&times;</a>`
    pTitle.innerHTML = `<p>${product.productName}</p>`
    pImage.innerHTML = `<img src=${product.product_img} alt="" />`
    pImage.classList.add("table_img")
    pPrice.innerHTML = `<p>$${product.product_price}</p>`
    pDescription.innerHTML = `<p>${product.productDescription}</p>`
    let tableCells = [pAction, pTitle, pImage, pPrice, pDescription]
    tableCells.forEach(elm => {
        elm.classList.add(`p_${product.id}`)
    })
    return tableCells;
}

export function addTableColumn(product) {
    let tableRows = document.querySelectorAll(".compare_modal table tr");
    let productData = gettableColumn(product);
    tableRows.forEach((elm, index) => {
        elm.append(productData[index])
    })
}
export function addProductToCompare(product) {

    let userData = getDataLS();
    let { comparingList } = userData;
    let compareListElm = document.querySelector(".compare_list");
    if (comparingList.length >= 4) {
        alert("can't compare more than 4 products")
        return false;
    }
    if (comparingList.length == 0) {
        compareListElm.append(getCompareItem(product))
        comparingList.push({ id: product.id, category: product.category })
        userData.comparingList = comparingList;
        setDataLS(userData);

    }
    else {
        let productCat = comparingList[0].category;
        // let compareSection = document.querySelector(".compare_section")
        if (product.category == productCat) {
            compareListElm.append(getCompareItem(product))
            comparingList.push({ id: product.id, category: product.category })
            userData.comparingList = comparingList;
            setDataLS(userData);
        }
        else {
            alert("can't compare this product with the others in the comparison list")
            return false;
        }
    }
    return true
}

export function loadProductInCompare() {
    let compareListElm = document.querySelector(".compare_list");
    let userData = getDataLS();
    let { comparingList } = userData;
    comparingList.forEach(elm => {
        dataService.getCustomProduct(`/${elm.id}`)
            .then(data => {
                compareListElm.append(getCompareItem(data))
            })
    });
}

