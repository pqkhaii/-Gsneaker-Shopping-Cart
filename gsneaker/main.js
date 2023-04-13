
// load data
const callApi = async () => {
    try {
        const response = await fetch("shoes.json");
        const data = await response.json();
        return data

    } catch (err) {
        console.log(err)
    }
}
callApi().then(
    data => {
        const listShoes = document.querySelector('#listShoes');

        data.shoes.forEach(item => {
            listShoes.innerHTML += `
            
                <div class="card mb-3 product border-0">
                <div><img class="product-image" width="100%" src="${item.image}" style="background-color: ${item.color}; border-radius: 25px; border: 2px ${item.color}"/></div>
                
                <div class="card-body pl-0">
                <h5 class="card-title product-name">${item.name}</h5>
                    <p class="card-text product-desc">${item.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                    <div class="card-text product-price">$${item.price}</div>
                    <button class="btn btn-warning mx-0" type="button" data-action="add-to-cart" onClick="handleAddSomething(event)">ADD TO CART</button>
                    </div>
                    </div>
                    
            `

        })
    }
);


let cart = [];
let cartTotal = 0;
const cartDom = document.querySelector("#cart");

function handleAddSomething(e) {

    const addtocartbtnDom = e.target;

    //
    const productDom = e.target.parentElement.parentElement.parentElement;
    const product = {
        img: productDom.querySelector(".product-image").getAttribute("src"),
        name: productDom.querySelector(".product-name").innerText,
        price: productDom.querySelector(".product-price").innerText,
        quantity: 1
    };
    // console.log(product)


    const IsinCart = cart.filter(cartItem => cartItem.name === product.name).length > 0;
    if (IsinCart === false) {
        cartDom.innerHTML += `
        <div class="cart-items container">
            <div class="flex-row justify-content-md-center" style="gap: 5%; margin-bottom: 16px">
                <div>
                    <div class="p-2">
                        <img src="${product.img}" alt="${product.name}" style="max-width: 150px;"/>
                    </div>
                    <div class="p-2">
                        <p class="cart_item_name">${product.name}</p>
                    </div>
                    <div class="p-2">
                        <p class="cart_item_price">${product.price}</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div class="d-flex align-items-center" style="gap: 12px; width: 80px">
                            <button class="btn_btn d-flex Justify-content-center align-items-center border" type="button" data-action="decrease-item"><img class="img_plus" src="img/minus.png"/></button>
                            <div class="cart_item_quantity">${product.quantity}</div>
                            <button class="btn_btn d-flex Justify-content-center align-items-center border" type="button" data-action="increase-item"><img class="img_plus" src="img/plus.png"/></button>
                        </div>
                        <button class="btn_remove d-flex Justify-content-center align-items-center border" type="button" data-action="remove-item"><img class="img_remove" src="img/trash.png"/></button>
                    </div>
                </div>
                
                <div>
                </div>
            </div>
        </div>`

        if (document.querySelector('.cart-footer') === null) {
            cartDom.insertAdjacentHTML("afterend", `
              <div class="d-flex flex-row shadow-sm card cart-footer mt-2 animated flipInX">
                <div class="p-2 ml-auto">
                  <button class="btn badge-dark" type="button" data-action="check-out">Pay <span class="pay"></span> 
                    &#10137;
                </div>
              </div>`);
        }

        //Set status

        addtocartbtnDom.innerText = "IN CART";

        addtocartbtnDom.disabled = true;
        cart.push(product);
        //-----------------------------------------------
        const cartItemsDom = cartDom.querySelectorAll(".cart-items");
        cartItemsDom.forEach(cartItemDom => {
            console.log("this is foreach called")
            //console.log(cartItemDom)
            if (cartItemDom.querySelector(".cart_item_name").innerText === product.name) {

                cartTotal += parseFloat(cartItemDom.querySelector(".cart_item_quantity").innerText)
                    * parseFloat(cartItemDom.querySelector(".cart_item_price").innerText.split("$")[1]);
                
                document.querySelector('.pay').innerText = cartTotal + " $";

                // increase item in cart
                cartItemDom.querySelector('[data-action="increase-item"]').addEventListener("click", () => {
                    cart.forEach(cartItem => {
                        const basePrice = Number(cartItem.price.split("$")[1]);

                        if (cartItem.name === product.name) {
                            cartItemDom.querySelector(".cart_item_quantity").innerText = ++cartItem.quantity;
                            cartItemDom.querySelector(".cart_item_price").innerText = parseFloat(cartItem.quantity) *
                                basePrice + " $";
                            console.log(basePrice);
                            cartTotal += basePrice;
                            console.log(cartTotal)
                            document.querySelector('.pay').innerText = cartTotal + " $";
                        }
                    });
                });

                // decrease item in cartFloat
                cartItemDom.querySelector('[data-action="decrease-item"]').addEventListener("click", () => {
                    cart.forEach(cartItem => {
                        if (cartItem.name === product.name) {
                            if (cartItem.quantity > 1) {
                                const basePrice = Number(cartItem.price.split("$")[1]);
                                cartItemDom.querySelector(".cart_item_quantity").innerText = --cartItem.quantity;
                                cartItemDom.querySelector(".cart_item_price").innerText = parseFloat(cartItem.quantity) *
                                    basePrice + " $";
                                cartTotal -= basePrice
                                document.querySelector('.pay').innerText = cartTotal + " $";
                            }
                        }
                    });
                });

                //remove item from cart
                cartItemDom.querySelector('[data-action="remove-item"]').addEventListener("click", () => {
                    cart.forEach(cartItem => {
                        console.log(cartItemDom)
                        if (cartItem.name === product.name) {
                            cartTotal -= Number(parseFloat(cartItemDom.querySelector(".cart_item_price").innerText.split("$")[1]));
                            document.querySelector('.pay').innerText = cartTotal + " $";
                            cartItemDom.remove();
                            cart = cart.filter(cartItem => cartItem.name !== product.name);
                            addtocartbtnDom.innerText = "ADD TO CART";
                            addtocartbtnDom.disabled = false;
                        }
                        if (cart.length < 1) {
                            document.querySelector('.cart-footer').remove();
                        }
                    });
                });
            }
        });
    }
}

