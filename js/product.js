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
    document.getElementById("productPrice").dataset.priceInCents=product.price;
    document.getElementById("productImg").setAttribute("src",product.imageUrl);

    fillColorsList(product.colors);
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
    let price = parseInt(document.getElementById("productPrice").dataset.priceInCents);
    let name = document.getElementById("productTitle").innerText;
    let imageUrl = document.getElementById("productImg").getAttribute("src");

    cart.addItem(productId,color,quantity,price,name,imageUrl);

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