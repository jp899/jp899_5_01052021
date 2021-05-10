
// Get orderId and price from local storage
let orderDataString = localStorage.getItem("orderData");

// If found in localStorage : fill the HTML with the price and orderId
if(orderDataString !== null){
    orderData = JSON.parse(orderDataString);
    document.getElementById("order-id").innerHTML = orderData.orderId;
    document.getElementById("order-price").innerHTML = formatPrice(orderData.totalPrice);
}