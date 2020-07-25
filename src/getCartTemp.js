export function getCartTemp(product, qty = 1) {
    // let fixedNavCart = document.querySelector(".fixed_nav .cart_items");
    let midNavCart = document.querySelector(".mid-nav .cart_items")
    let cartProduct = document.createElement("div");
    cartProduct.classList.add("cart_product");
    cartProduct.innerHTML = `
        <div class="cart_item_img">
            <img
                src= ${product.product_img}
                alt=""
            />
        </div>
        <div class="cart_product_info_${product.id}">
            <h2>${product.productName}</h2>
            <p>
                QTY: 
                <span class="cart_product_qty"
                    >${qty}</span
                >x <span class="cart_product_price">
                    $${(product.product_price * (100 - product.discount) / 100)}
                </span>
            </p>
        </div>
        
    `
    // <div class="cart_delete_product">
    //     <a class="cart_delete_btn" data-pn=${product.id} href="javascript:void(0);"><span>&times;</span></a>
    // </div>




    // cartItemsCont.forEach(elm => elm.appendChild(cartProduct))
    midNavCart.appendChild(cartProduct)
    // fixedNavCart.appendChild(cartProduct.cloneNode(true));
} 
