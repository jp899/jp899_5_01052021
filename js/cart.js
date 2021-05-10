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
     * @param {number} price The price of the product.
     * @param {string} name The name of the product.
     * @param {string} imageUrl The Url where the image of the product can be fetched.
     * @throws {TypeError} - If one of the arguments is not of expected type.
     */
    constructor(productId,color,quantity,price,name,imageUrl){

        if(typeof(productId) !== "string" 
            || typeof(color) !== "string"
            || typeof(name) !== "string"
            || typeof(imageUrl) !== "string"
            || typeof(quantity) !== "number" 
            || ! Number.isInteger(quantity)
            || typeof(price) !== "number" || ! Number.isInteger(price)){
                throw new TypeError("Incorrect arguments");
        }
        
        this.productId=productId;
        this.color=color;
        this.quantity=quantity;
        this.price=price;
        this.imageUrl=imageUrl;
        this.name=name;
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
            this.getFromLocalStorage();
        }
        else{
            this.saveInLocalStorage();
        }
    }


    /**
     * Returns the cumulative quantity of all items.
     * @return {number} - the cumulative quantity of all items.
     */
    getTotalPrice(){
        let totalPrice=0;

        for(let item of this){
            totalPrice+=item.price*item.quantity;
        }

        return totalPrice;
    }


    /**
     * Returns a list of all the productsId in the cart.
     * If a item has a quantity of n, the list contains n times its productId.
     * @return {string[]} - List of productId.
     */
    getListOfProducts(){
        let listOfProducts=[];
        for(item of this){
            for(let i = 0; i < item.quantity; i++){
                listOfProducts.push(item.productId);
            }
        }
        return listOfProducts;
    }

    /**
     * Check if the localstorage has been changed by another page.
     * @return {boolean} - True if the cart has been changed.
     */
    hasChanged(){
        let cartString = localStorage.getItem("cart");
        return cartString !== this.cartString;
    }

    /**
     * Save the array in localStorage. Overwrites the existing cart data.
     */
    saveInLocalStorage(){
        let cartString = JSON.stringify(this.itemList);
        localStorage.setItem("cart",cartString);

        // Save in the item the last known localStorage state
        this.cartString = cartString;
    }

    /**
     * Load the array data from localStorage. Overwrites the Cart object array.
     */
    getFromLocalStorage(){
        let cartString = localStorage.getItem("cart");
        this.itemList = JSON.parse(cartString);

        // Save in the item the last known localStorage state
        this.cartString = cartString;
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

        for(let cartItem of this){
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
     * @param {number} price The unit price of the product.
     */
    addItem(productId,color,quantity,price,name,imageUrl){
        if(typeof(productId) !== "string" 
        || typeof(color) !== "string"
        || typeof(name) !== "string"
        || typeof(imageUrl) !== "string"
        || typeof(quantity) !== "number" 
        || ! Number.isInteger(quantity)
        || typeof(price) !== "number" || ! Number.isInteger(price)){
            throw new TypeError("Incorrect arguments");
        }

        // Reload the data from localstorage if it has been modified by another page
        if (this.hasChanged()){
            this.getFromLocalStorage();
        }

        let cartItem=cart.searchItem(productId,color);
        // Add the item to the cart if it's not already in the cart.
        if(cartItem === null){
            let newCartItem=new CartItem(productId,color,quantity,price,name,imageUrl);
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
     * @param {string} productId The product id to target.
     * @param {string} color The color to target.
     */
    removeItem(productId,color){
        let index=this.searchItemIndex(productId,color);
        if(index === -1){
            return;
        }

        this.itemList.splice(index,1);
        this.saveInLocalStorage();
    }

    
    /**
     * Increase the quantity of the product with given id and color.
     * SAVE the updated array in localstorage.
     * @param {string} productId The product id to target.
     * @param {string} color The color to target.
     * @param {string} [quantity=1] The quantity to add.
     */
     increaseQuantityOfItem(productId,color,quantity = 1){
        let item=this.searchItem(productId,color);
        if(item === null){
            return;
        }

        item.quantity += quantity;
        this.saveInLocalStorage();
    }

    /**
     * Decrease the quantity of the product with given id and color.
     * SAVE the updated array in localstorage.
     * @param {string} productId The product id to target.
     * @param {string} color The color to target.
     * @param {string} [quantity=1] The quantity to substract.
     */
     decreaseQuantityOfItem(productId,color,quantity = 1){
        let item=this.searchItem(productId,color);
        if(item === null){
            return;
        }

        item.quantity -= quantity;
        this.saveInLocalStorage();
    }


    /**
     * Make the cart iterable with (for...of).
     * @returns {IterableIterator}
     */
    [Symbol.iterator](){
        return this.itemList.values();
    }

}

