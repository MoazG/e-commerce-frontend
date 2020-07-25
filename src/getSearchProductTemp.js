export function getSearchProductTemp(product) {
    let liContainer = document.createElement("li");
    liContainer.classList.add("suggestion");
    let productTemp = `
        <a href="">
            <div class="product_search_cont">
                <div class="search_img">
                    <img src=${product.product_img} alt="" />
                </div>
                <div class="search_title">
                    <h3>
                        ${product.productName}
                    </h3>
                </div>
            </div>
        </a>
    `
    liContainer.innerHTML = productTemp;
    return liContainer;
}
