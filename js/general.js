// GENERAL FUNCTIONS AND DATA USED THROUGH ALL PAGES


const backAPIUrlRoot = "http://localhost:3000/api/teddies/";
const backAPIUrlOrder = backAPIUrlRoot + "order";


/**
 * Converts the price to display format.
 * @param {number} price The price to convert, must be number/integer and in cents.
 * @throws {TypeError} If bad arguments.
 * @return {string} - The price ready to display.
 */
 function formatPrice(price){
    if (typeof(price) !== "number" || ! Number.isInteger(price)){
        throw new TypeError("Argument must be integer");
    }

    //Convert price to string.
    let priceString=""+price;

    //Add comma and missing zeroes to get from cents to euros.
    switch(priceString.length){
        case 1:
            priceString="00,0"+priceString;
            break;
        case 2:
            priceString="00,"+priceString;
            break;
        case 3:
            priceString="0"+priceString.slice(0,-2)+","+priceString.slice(-2);
            break;
        default:
            priceString=priceString.slice(0,-2)+","+priceString.slice(-2);
    }

    //Add currency symbol befor return.
    return priceString+" &euro;";
}


/**
 * Create a <div> containing an error message.
 * @param {Error} error The error to get the message from'.
 * @return {HTMLDivElement} - The <div> element.
 */
 function buildErrorElement(error){
    let newElement=document.createElement("div");
    newElement.innerHTML=error.message;
    newElement.classList.add("h2","text-center","text-white","bg-danger","py-3","rounded-lg");
    return newElement;
    
}


/**
 * Fetch the list of products from the server.
 * @return {Promise} - Promise resolving with the json sent in the server response.
 * @throws {Error} Error status if fetching is not OK.
 */
 async function getProductList(){
    const result = await fetch(backAPIUrlRoot);
    if(result.ok){
        return result.json();
    }
    else{
        throw new Error("ERREUR " + result.status);
    }
}


/**
 * Fetch a specific product from the server.
 * @param {string} productId - Id of the product to fetch.
 * @return {Promise} - Promise resolving with the json sent in the server response.
 * @throws {Error} Error status if fetching is not OK.
 */
 async function getProduct(productId){
    const result = await fetch(backAPIUrlRoot+productId);
    if(result.ok){
        return result.json();
    }
    else{
        throw new Error("ERREUR " + result.status);
    }
}


/**
 * Send a request to order a list of products for the user.
 * @param {Object} contactData - User data to send to the server.
 * @param {string[]} listOfProducts - List of the productIds of the items to order.
 * @return {Promise} - Promise resolving with the json sent in the server response.
 * @throws {Error} Error status if fetching is not OK.
 */
 async function sendOrderRequest(contactData,listOfProducts){
    const result = await fetch(backAPIUrlOrder, 
                                {method: "POST",
                                headers: {'Accept':'application/json',
                                        'Content-Type':'application/json'},
                                body:JSON.stringify({contact: contactData,
                                                    products: listOfProducts})
                                });

    if(result.ok){
        return result.json();
    }
    else{
        throw new Error("ERREUR " + result.status);
    }
}