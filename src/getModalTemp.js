export function getModal(product) {
    let modalContainer = document.createElement("div");
    modalContainer.classList.add("modal_container");

    let modalTemp = `
                <div class="title">
                    <h1 class="product_name">${product.productName}</h1>
                    <span class="close">&times;</span>
                </div>
                <div class="modal_flex">
                    <div class="product_image">
                        <img src=${product.product_img} alt="" />
                        <div class="product_label">
                        <ul>
                        ${product.qty == 0 ? "<li class='sold_out'><span>SoldOut</span></li>" : `
                        ${product.new ? '<li><span>New</span></li>' : ""}
                        ${product.sale ? `<li><span>sale</span></li>
                        <li><span>${product.discount}%</span></li>` : ""}
                        `}
                        </ul>            
                    </div>
                    </div>
                    <div class="product_info">
                    <div class="modal_product_price">
                        ${product.sale ? `<h3 class="product_price">
                                $${product.product_price * (100 - product.discount) / 100}</h3>
                                <p><span class='discount'>$ ${product.product_price}</span>
                                You Will Save $${product.product_price * (product.discount / 100)}  </p>
                                ` : `<h3 class="product_price">$${product.product_price}</h3>`}          
                        <p>All prices include VAT</p>
                        <h4>FREE Shipping</h4>
                    </div>
                    <div class="modal_product_prop">
                        <ul>
                            <li>
                                <h4>Manufactory:</h4>
                                <p>${product.brand}</p>
                            </li>
                            <li>
                                <h4>Color:</h4>
                                <p>black</p>
                            </li>
                        </ul> 
                    </div>
                    <div class="modal_product_desc">
                        <h4>Description:</h4>
                        <p>${product.productDescription}</p>
                    </div>   
                    </div>
                    <div class="product_modal_btn">
                        <div class="qty">
                            <p>QTY</p>                            
                            <div class="dec">&minus;</div>
                            <div class="qty_num">1</div>
                            <div class="inc">&plus;</div>
                        </div>
                        <div class="add_to_cart">
                            ${product.qty == 0 ? '<a class="btn_sold btn" href="javascript:void(0);">Sold Out</a>' :
            `<a href="javascript:void(0);" class="add_cart_btn btn" data-pn =${product.id}>add to cart</a>`}  
                        </div> 
                    </div>
                </div>
                `
    modalContainer.innerHTML = modalTemp;
    return modalContainer
}
