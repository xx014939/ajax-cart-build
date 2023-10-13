
window.addEventListener("load", (event) => {

    const shippingBar = document.querySelector('.shipping-bar')
    const priceContainer = document.querySelector('.cart-total')

    // Calculate current percentage of treshold
    let threshold = 75.00
    let cartTotalStr = document.querySelector('.cart-total-value').innerHTML
    let cartTotal =  parseFloat(cartTotalStr.match(/[\d\.]+/))

    // Set width to be equal to percentage
    let currentProgress = ((cartTotal / threshold) * 100)
    if (currentProgress <= 100) {
      shippingBar.style.width = `${currentProgress}%`
    } else {
      shippingBar.style.width = `100%`
    }


    // Use mutation observer to dynamically update cart based on cart changes
    const mutationObserver = new MutationObserver(mutationRecords => {
      let threshold = 75.00

      let cartTotalStr = document.querySelector('.cart-total-value').innerHTML
      let cartTotal =  parseFloat(cartTotalStr.match(/[\d\.]+/))

      if (threshold <= cartTotal) {
        document.querySelector('.shipping-message').innerHTML = 'You qualify for free shipping 🎉'
        shippingBar.style.width = '100%'
      } else {
        let remainder = (threshold - cartTotal).toFixed(2)
        document.querySelector('.shipping-message').innerHTML = `Just spend another £${remainder} to get free shipping!`
        let currentProgress = ((cartTotal / threshold) * 100)
        shippingBar.style.width = `${currentProgress}%`
      }
    });

    // observe changes to cart price
    mutationObserver.observe(priceContainer, {
      childList: true,
      subtree: true,
      characterData: true
    })
});