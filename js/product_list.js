
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

// FIN  DES FONCTIONS COMMUNES

/**
 * Display the <div> containing an error message in place of the product list.
 * @param {HTMLDivElement} errorElement .
 */
function addErrorToProductList(errorElement){      
    errorElement.classList.add("col-12","col-md-4","offset-md-4");
    document.getElementById("product_list").append(errorElement);
}


/**
 * Fetch the list of products from the server.
 * @return {Promise} - Promise resolving with the json sent in the server response.
 * @throws {Error} Error status if fetching is not OK.
 */
async function getProductList(){
    const result = await fetch("http://localhost:3000/api/teddies");
    if(result.ok){
        return result.json();
    }
    else{
        throw new Error("ERREUR " + result.status);
    }
}


/**
 * Build the HTML structure and content of a product card.
 * @param {Object} product- Product object to get the data from.
 * @return {HTMLDivElement} - HTML element ready to display.
 */
function buildProductCard(product){
    let newCard=document.createElement("div");
    newCard.classList.add("col-12","col-lg-4");
    newCard.innerHTML=`<div class="card mt-3 mb-2 my-lg-3 shadow rounded-lg">
                            <img src="${product.imageUrl}" alt="Photo d'ours en peluche" class=".card-img-top rounded-lg">
                            <div class="card-body">
                                <h2 class="card-title">${product.name}</h2>
                                <p class="card-text">${product.description}</p>
                                <div class ="row">
                                    <div class="col-7">
                                        <a class="btn btn-info" href="html/produit.html?productId=${product._id}"> 
                                        Plus de détails
                                        </a>
                                    </div>
                                    <div class="col-5 text-right">
                                        <div class="price h4 text-success">
                                        ${formatPrice(product.price)}
                                        </div>
                                    </div>  
                                </div>
                            </div>
                         </div>`;
    return newCard;
}


getProductList()
.then(function(productList){
    for (let product of productList){
        let newCard=buildProductCard(product);
        document.getElementById("product_list").appendChild(newCard);
    }
})
.catch(function(error){
    console.log(error);
    let errorElement=buildErrorElement(error);
    addErrorToProductList(errorElement);
});

