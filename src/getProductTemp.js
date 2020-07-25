export function getProduct(product) {
    let productElement = document.createElement("div")
    let producsTemplate = `<div class="product_img">
            <img src=${product.product_img} alt="" />
        </div>
        <div class="product_info">
            <h3 class="product_price">
               ${product.sale ? ` 
                        <span class='discount'>$ ${product.product_price}</span>
                        ${product.product_price * (100 - product.discount) / 100}` : "$" + product.product_price}          
            </h3>
            <p class="product_name">${product.productName}</p>
        </div>
        <div class="product_label">
            <ul>
                ${product.qty == 0 ? "<li class='sold_out'><span>SoldOut</span></li>" : `
                ${product.new ? '<li><span>New</span></li>' : ""}
                ${product.sale ? `<li><span>sale</span></li>
                <li><span>${product.discount}%</span></li>` : ""}
                `}
            </ul>

        </div>
        <div class="add_to_cart">
            ${product.qty == 0 ?
            '<a class="btn btn_sold" >Sold Out</a>' :
            `<a class="btn" href="javascript:void(0);" 
            class="add_cart_btn" data-pn=${product.id} >
            add to cart</a>`}  
        </div>
        <div class="action_link">
            <ul data-product-id = ${product.id}>
                <li class="add_wishlist">
                    <a href="javascript:void(0);"><i class="far fa-heart"></i></a>
                    <div class="tooltip_text">
                        <p>wishing list</p>
                    </div>
                </li>
                <li class="add_compare">
                    <a href="javascript:void(0);">
                        <i class="fas fa-sliders-h"></i>
                    </a>
                    <div class="tooltip_text">
                        <p>compare</p>
                    </div>
                </li>
                <li class="quick_view" data-product-id = ${product.id}>
                    <a href="javascript:void(0);">
                        <i class="fas fa-search"></i>
                    </a>
                    <div class="tooltip_text">
                        <p>discover</p>
                    </div>
                </li>
            </ul>
        </div>`

    productElement.innerHTML = producsTemplate;
    productElement.classList.add("product", "col-1-5")
    return productElement
}
