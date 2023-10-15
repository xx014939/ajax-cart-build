let openCart = document.querySelector('.open-ajax-cart')
let closeCart = document.querySelector('.close-ajax-cart')
let cartContainer = document.querySelector('.ajax-slide-cart-container')
let cartItemsContainer = document.querySelector('.ajax-cart-items-container')
let total = document.querySelector('.ajax-cart-footer ')

openCart.addEventListener('click', async () => {
    // Open cart drawer
    cartContainer.classList.toggle('ajax-cart-closed')
    cartContainer.classList.toggle('ajax-cart-open')

    // Get contents
    let data = await fetch(window.Shopify.routes.root + 'cart.js')
    let cartContents = await data.json()
    console.log(cartContents)

    // Get line items
    let cartItems = cartContents.items
    console.log(cartContents.items[0])

    // Get existing items in HTML
    let existingItems = document.querySelectorAll('.ajax-cart-item')

    if (existingItems.length != cartItems.length) {
        // Populate line items
        cartItems.forEach(item => {
            cartItemsContainer.append(createCartItem(item.product_title, item.image, item.price, item.quantity, item.variant_id))
        });
    }

    // Display total price
    total.innerHTML = `£${cartContents.total_price / 100}`

})

closeCart.addEventListener('click', () => {
    // Close cart drawer
    cartContainer.classList.toggle('ajax-cart-closed')
    cartContainer.classList.toggle('ajax-cart-open')
})


function createCartItem(name, image, price, quantity, id) {

    // Line item container
    let newCartItem = document.createElement('div')
    newCartItem.classList.add('ajax-cart-item')
    newCartItem.id=`${id}-container`

    // Line item details container
    let lineItemDetails = document.createElement('div')
    lineItemDetails.classList.add('ajax-cart-item-details')

    // Quantity buttons container
    let btnContainer = document.createElement('div')
    btnContainer.classList.add('ajax-cart-quantity-btn-container')

    // Image
    let itemImage = document.createElement('img')
    itemImage.src = `${image}`
    // Item name
    let itemName = document.createElement('div')
    itemName.innerHTML = `${name}`
    // Price
    let itemPrice = document.createElement('div')
    itemPrice.innerHTML = `£${(price / 100)}`
    // Quantity
    let itemQuantity = document.createElement('div')
    itemQuantity.id = `${id}-quantity`
    itemQuantity.innerHTML = `${quantity}`

    // Increase btn
    let increaseBtn = document.createElement('button')
    increaseBtn.innerHTML = 'Increase'
    increaseBtn.id = `${id}`
    increaseBtn.onclick = increaseQuantity
    increaseBtn.classList.add('increase-quantity')

    // Decrease btn
    let decreaseBtn = document.createElement('button')
    decreaseBtn.innerHTML = 'Decrease'
    decreaseBtn.id = `${id}`
    decreaseBtn.onclick = decreaseQuantity
    decreaseBtn.classList.add('decrease-quantity')

    // Delete btn
    let deleteBtn = document.createElement('button')
    deleteBtn.innerHTML = 'Delete'
    deleteBtn.id = `${id}`
    deleteBtn.onclick = deleteProduct
    deleteBtn.classList.add('delete-quantity')

    // Add item and details to containers
    lineItemDetails.append(itemName)
    lineItemDetails.append(itemPrice)
    lineItemDetails.append(itemQuantity)

    btnContainer.append(increaseBtn)
    btnContainer.append(decreaseBtn)
    btnContainer.append(deleteBtn)

    newCartItem.append(itemImage)
    newCartItem.append(lineItemDetails)
    newCartItem.append(btnContainer)

    return newCartItem
}

async function increaseQuantity () {

    // Increase quantity by 1
    const increaseResponse = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({quantity: 1, id: `${this.id}`})
    });
    
    const result = await increaseResponse.json();

    console.log(result); // remove in production

    // Update quantity in HTML
    let currentQuantity = document.getElementById(`${this.id}-quantity`)
    currentQuantity.innerHTML++

    updateTotal()
}

async function decreaseQuantity () {

    // Retrieve variant ID and quantity 
    let currentId = this.id
    let currentQuantityValue = document.getElementById(`${currentId}-quantity`).innerHTML
    

    if (currentQuantityValue > 1) {
        // Decrease quantity by 1
        const decreaseResponse = await fetch('/cart/change.js', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({quantity: `${currentQuantityValue - 1}`, id: `${this.id}`})
        });
        
        const result = await decreaseResponse.json();
        
        console.log(result); // remove in production

        // Update quantity in HTML
        let currentQuantity = document.getElementById(`${this.id}-quantity`)
        currentQuantity.innerHTML--
    } else {
        
        // Remove item
        const removeResponse = await fetch('/cart/change.js', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({quantity: 0, id: `${this.id}`})
        });

        const result = await removeResponse.json();
        console.log(result); // remove in production

        // Remove item from cart
        let deletedItem = document.getElementById(`${this.id}-container`)
        deletedItem.remove()
    }

    updateTotal()
}

async function deleteProduct() {

    // Remove item
    const removeResponse = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({quantity: 0, id: `${this.id}`})
    });

    const result = await removeResponse.json();
    console.log(result); // remove in production

    // Remove item from cart
    let deletedItem = document.getElementById(`${this.id}-container`)
    deletedItem.remove()

    updateTotal()
}

async function updateTotal() {
    let data = await fetch(window.Shopify.routes.root + 'cart.js')
    let cartContents = await data.json()
    total.innerHTML = `£${cartContents.total_price / 100}`
}