
/**
 * Represents an item that can be added to cart.
 * @class
 */
class CartItem{

    /**
     * Create a CartItem instance.
     * @param {string} productId The id of the product.
     * @param {string} color The color of the product.
     * @param {number} quantity The quantity of the product.
     * @throws {TypeError} - If one of the arguments is not of expected type.
     */
    constructor(productId,color,quantity){

        if(typeof(productId) !== "string" 
            || typeof(color) !== "string"
            || typeof(quantity) !== "number" 
            || ! Number.isInteger(quantity)){
                throw new TypeError("Incorrect arguments");
        }
        
        this.productId=productId;
        this.color=color;
        this.quantity=quantity;
    }

}

/**
 * Represents the cart. It contains an array of CartItems.
 * This array can be saved/loaded to/from localstorage.
 * There can be serveral items with the same productId, as long as they have different colors.
 * Only one item with the same productId and Color can exist in the array.
 * The property : quantity of this item can go from 1 to infinity.
 * @class
 */
class Cart{

    /**
     * Create a Cart instance.
     * If the cart has been saved in another page : load the array from localstorage.
     * If there is no cart data in localstorage : creates a empty array.
     */
    constructor(){
        this.itemList=[];

        if(localStorage.getItem('cart')){
            this.getFromLocalStorage()
        }
    }

    /**
     * Returns the number of distincts items in the array.
     * @return {number} - the number of distincts items.
     */
    getNbOfDifferentItems(){
        return this.itemList.length;
    }

    /**
     * Returns the cumulative quantity of all items.
     * @return {number} - the cumulative quantity of all items.
     */
    getTotalNbOfItems(){
        let totalNbOfItems=0;

        for(let item in this.itemList){
            totalNbOfItems+=item.quantity;
        }

        return totalNbOfItems;
    }

    /**
     * Save the array in localStorage. Overwrites the existing cart data.
     */
    saveInLocalStorage(){
        let cartString = JSON.stringify(this.itemList);
        localStorage.setItem("cart",cartString);
    }

    /**
     * Load the array data from localStorage.
     */
    getFromLocalStorage(){
        let cartString = localStorage.getItem("cart");
        this.itemList = JSON.parse(cartString);
    }

    /**
     * Add a item to the array
     * @param {CartItem} cartItem The item to add to the array.
     * @throws {TypeError} - If the argument is not of expected type.
     */
    pushItem(cartItem){
        if(! cartItem instanceof CartItem){
            throw new TypeError("Argument must be CartItem Object");
        }

        this.itemList.push(cartItem);
    }

    /**
     * Search an item in the cart with the specified properties.
     * @param {string} productId The product id to look for.
     * @param {string} color The color to look for.
     * @return {CartItem} - The item if found || null if not found.
     */
    searchItem(productId,color){
        if(typeof(productId) !== "string" 
            || typeof(color) !== "string"){
            throw new TypeError("Incorrect arguments");
        }

        for(let cartItem of this.itemList){
            if (cartItem.productId === productId && cartItem.color === color){
                return cartItem;
            }
        }

        //if not found
        return null;
    }

    /**
     * Search the index of the object in the cart with the specified properties.
     * @param {string} productId The product id to look for.
     * @param {string} color The color to look for.
     * @return {number} - The index of the item if found || -1 if not found.
     */
    searchItemIndex(productId,color){
        if(typeof(productId) !== "string" 
            || typeof(color) !== "string"){
            throw new TypeError("Incorrect arguments");
        }

        for(let index in this.itemList){
            if (this.itemList[index].productId === productId && this.itemList[index].color === color){
                return index;
            }
        }

        //if not found
        return -1;
    }

    /**
     * Clear the array. Also clear the cart in localstorage.
     */
    clear(){
        this.itemList=[];
        this.saveInLocalStorage();
    }

    /**
     * Look if the array is empty.
     * @return {boolean} - True if empty || False if not empty.
     */
    isEmpty(){
        return this.itemList.length === 0;
    }

    /**
     * If the same item (productId and color) already exist in the array,
     * add the quantity of the existing item.
     * If not : Add an new item with the specified properties to the cart.
     * SAVE the updated array in localstorage.
     * @param {string} productId The product id to add.
     * @param {string} color The color to add.
     * @param {number} quantity The quantity to add.
     */
    addItem(productId,color,quantity){
        if(typeof(productId) !== "string" 
        || typeof(color) !== "string"
        || typeof(quantity) !== "number" 
        || ! Number.isInteger(quantity)){
            throw new TypeError("Incorrect arguments");
        }

        let cartItem=cart.searchItem(productId,color);
        // Add the item to the cart if it's not already in the cart.
        if(cartItem === null){
            let newCartItem=new CartItem(productId,color,quantity);
            this.pushItem(newCartItem);
        }
        // Update the item if it's already in the cart for the desired color.
        else{
            cartItem.quantity+=quantity;
        }

        this.saveInLocalStorage();
    }


    /**
     * Remove the item with given productId and color.
     * SAVE the updated array in localstorage.
     * @param {string} productId The product id to add.
     * @param {string} color The color to add.
     */
    removeItem(productId,color){
        let index=searchItemIndex(productId,color);
        if(index === -1){
            return;
        }

        this.itemList.splice(index,1);
        this.saveInLocalStorage();
    }
}





/**
 * Create a <div> containing an error message.
 * @param {Error} error The error to get the message from'.
 * @return {HTMLDivElement} - The <div> element.
 */
function buildErrorElement(error){
    const newElement=document.createElement("div");
    newElement.innerHTML=error.message;
    newElement.classList.add("h2","text-center","text-white","bg-danger","py-3","rounded-lg");
    return newElement;
}


/**
 * Converts the price to display format.
 * @param {number} price The price to convert, must be number and integer.
 * @return {string} - The price ready to display.
 */
function formatPrice(price){
    if (typeof(price) !== "number" || ! Number.isInteger(price)){
        return;
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

    //Add currency symbol befor return
    return priceString+" &euro;";
}

// FIN  DES FONCTIONS COMMUNES

/**
 * Display a <div> containing an error message in the <main>.
 * @param {HTMLDivElement} errorElement <div> containing an error message.
 */
function addErrorToMain(errorElement){
    const mainElement=document.getElementsByTagName("main")[0];

    //First : Create a row <div>
    let newDivElement=document.createElement("div");
    newDivElement.classList.add("row","mt-4","mb-3");
    //Then add the error <div> as a column of the row <div> 
    errorElement.classList.add("col-12","col-md-4","offset-md-4");
    newDivElement.append(errorElement);

    //Empty the <main> element to replace its content with the <div>
    mainElement.innerHTML="";
    mainElement.append(newDivElement);
}


/**
 * Get the product id from the parameters of the url.
 * @return {string} - The id of the product to display.
 */
function processParameters(){
    const urlString = location.toString();
    const url = new URL(urlString);
    let productId=url.searchParams.get("productId");

    return productId;
}


/**
 * Fills the #article-color element with all the possible options.
 * @param {string[]} colors List of the possible colors.
 */
function fillColorsList(colors){
    for(let color of colors){
        let newOptionElement=document.createElement("option");
        newOptionElement.innerHTML=color;
        document.getElementById("article-color").append(newOptionElement);
    }
}


/**
 * Fills the content of the HTML with the properties of the product.
 * @param {Object} product Product to get the data from.
 */
function fillProductData(product){
    document.title="Orinoco - "+product.name;
    document.getElementById("productTitle").innerHTML=product.name;
    document.getElementById("productDescription").innerHTML=product.description;
    document.getElementById("productPrice").innerHTML=formatPrice(product.price);
    document.getElementById("productImg").setAttribute("src",product.imageUrl);

    fillColorsList(product.colors);
}


/**
 * Fetch a specific product from the server.
 * @param {string} productId- Id of the product to fetch.
 * @return {Promise} - Promise resolving with the json sent in the server response.
 * @throws {Error} Error status if fetching is not OK.
 */
async function getProduct(productId){
    const result = await fetch(`http://localhost:3000/api/teddies/${productId}`);
    if(result.ok){
        return result.json();
    }
    else{
        throw new Error("ERREUR " + result.status);
    }
}


/**
 * Callback for adding to the cart the product currently displayed in the page.
 * Gets the productId from global variable.
 * Gets the color and quantity desired from the DOM.
 * @param {Event} event - Event that triggered the callback.
 */
function addToCart(event){
    event.preventDefault();
    let color=document.getElementById("article-color").value;
    let quantity=parseInt(document.getElementById("article-quantity").value);
    
    cart.addItem(productId,color,quantity);

    alert("Article ajouté au panier.");
}

/**
 * Callback for minus button.
 * Decrease the quantity desired.
 * @param {Event} event - Event that triggered the callback.
 */
 function decreaseQuantity(event){
    event.preventDefault();
    let quantity=parseInt(document.getElementById("article-quantity").value);

    // Can't go lower than 1.
    if(quantity > 1){
        document.getElementById("article-quantity").value=quantity-1;
    }
}

/**
 * Callback for plus button.
 * Increase the quantity desired.
 * @param {Event} event - Event that triggered the callback.
 */
 function increaseQuantity(event){
    event.preventDefault();
    let quantity=parseInt(document.getElementById("article-quantity").value);

    document.getElementById("article-quantity").value=quantity+1;
}




const cart=new Cart();
const productId=processParameters();

getProduct(productId)
.then(function(product){
    fillProductData(product);
    document.getElementById("addToCartButton").addEventListener("click",addToCart);
    document.getElementById("quantityMinusButton").addEventListener("click",decreaseQuantity);
    document.getElementById("quantityPlusButton").addEventListener("click",increaseQuantity);
})
.catch(function(error){
    console.log(error);
    const errorElement=buildErrorElement(error);
    addErrorToMain(errorElement);
});