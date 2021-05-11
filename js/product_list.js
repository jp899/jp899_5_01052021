/**
 * Display the <div> containing an error message in place of the product list.
 * @param {HTMLDivElement} errorElement .
 */
function addErrorToProductList(errorElement){      
    errorElement.classList.add("col-12","col-md-4","offset-md-4");
    document.getElementById("product_list").append(errorElement);
}


/**
 * Build the HTML structure and content of a product card.
 * @param {Object} product- Product object to get the data from.
 * @return {HTMLDivElement} - HTML element ready to display.
 */
function buildProductCard(product){
    let newCard = document.createElement("div");
    newCard.classList.add("col");
    newCard.innerHTML = `<div class="card mt-3 mb-2 mx-sm-5 mx-md-auto my-lg-3 shadow rounded-lg">
                            <img src="${product.imageUrl}" alt="Photo d'ours en peluche" class="card-img-top img-product-card rounded-lg">
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
        let newCard = buildProductCard(product);
        document.getElementById("product_list").appendChild(newCard);
    }
})
.catch(function(error){
    console.log(error);
    let errorElement = buildErrorElement(error);
    addErrorToProductList(errorElement);
});

