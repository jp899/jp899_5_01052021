/**
 * Callback for minus button.
 * Decrease the quantity displayed and updates the cart.
 * @param {Event} event - Event that triggered the callback.
 */
 function decreaseQuantity(event){
    event.preventDefault();
    // Get the info to locate the row in wich the button has been clicked.
    let productId=event.currentTarget.dataset.targetProductId;
    let color=event.currentTarget.dataset.targetColor;

    // If the cart has been modified by another page, refresh the cart and the table
    if (cart.hasChanged()){
        cart.getFromLocalStorage();
        refreshTable();
    }

    // Get the row in wich the button has been clicked.
    let currentRow=document.querySelector(`[data-product-id="${productId}"][data-color="${color}"]`);

    if(currentRow !== null){
        // Get the current quantity of the item.
        let quantity=parseInt(currentRow.querySelector(".article-quantity").value);

        // // Can't go lower than 1.
        if(quantity > 1){
            currentRow.querySelector(".article-quantity").value=quantity-1;
            cart.decreaseQuantityOfItem(productId,color);
            updateDisplayedTotalPrice();
        }
    }
}

/**
 * Callback for plus button.
 * Increase the quantity displayed and updates the cart.
 * @param {Event} event - Event that triggered the callback.
 */
 function increaseQuantity(event){
    event.preventDefault();

    // Get the info to locate the row in wich the button has been clicked.
    let productId=event.currentTarget.dataset.targetProductId;
    let color=event.currentTarget.dataset.targetColor;

    // If the cart has been modified by another page, refresh the cart and the table
    if (cart.hasChanged()){
        cart.getFromLocalStorage();
        refreshTable();
    }

    // Get the row in wich the button has been clicked.
    let currentRow=document.querySelector(`[data-product-id="${productId}"][data-color="${color}"]`);

    if(currentRow !== null){
        // Get the current quantity of the item.
        let quantity=parseInt(currentRow.querySelector(".article-quantity").value);

        currentRow.querySelector(".article-quantity").value=quantity+1;
        cart.increaseQuantityOfItem(productId,color);
        updateDisplayedTotalPrice();
    }
}

/**
 * Callback for delete button.
 * Removes the item from the displayed table and from the cart
 * @param {Event} event - Event that triggered the callback.
 */
 function deleteItem(event){
    event.preventDefault();

    // Get the info to locate the row in wich the button has been clicked.
    let productId=event.currentTarget.dataset.targetProductId;
    let color=event.currentTarget.dataset.targetColor;

    // If the cart has been modified by another page, refresh the cart and the table
    if (cart.hasChanged()){
        cart.getFromLocalStorage();
        refreshTable();
    }

    // Get the row in wich the button has been clicked.
    let currentRow=document.querySelector(`[data-product-id="${productId}"][data-color="${color}"]`);

    if(currentRow !== null){
        currentRow.remove();
        cart.removeItem(productId,color);
        updateDisplayedTotalPrice();
    }

}


/**
 * Build the HTML structure and content of a row of the items table.
 * @param {Object} item- Item to add.
 * @param {Object} productData- Additionnal data of the product.
 * @return {HTMLDivElement} - HTML element ready to display.
 */
 function buildItemRow(item){
    let newRow=document.createElement("tr");
    // Add data attributes to the row, to ease identification of each row
    newRow.dataset.productId=item.productId;
    newRow.dataset.color=item.color;

    newRow.innerHTML =
        `<td class="d-none d-sm-table-cell">
            <img src="${item.imageUrl}" class="img-fluid" alt="Photo d'ours en peluche">
        </td>
        <td><a href="produit.html?productId=${item.productId}">${item.name}</a></td>
        <td>${item.color}</td>
        <td class="text-nowrap">${formatPrice(item.price)}</td>
        <td class="px-0">
            <form>
                <div class="form-group form-inline">

                    <span class="input-group ml-sm-3">

                        <input style="max-width:60px" type="text" name="article-quantity" 
                        class="article-quantity mx-1 form-control  bg-white" value="${item.quantity}" min="1" max="100" readonly>
                        
                        <div class="flex-column">
                    
                            <button type="button" class="d-block quantityPlusButton btn btn-secondary btn-sm py-0 mb-1" 
                             data-target-product-id="${item.productId}" data-target-color="${item.color}">
                                <i class="fas fa-plus"></i>
                            </button>

                            <button type="button" class="d-block quantityMinusButton btn btn-secondary btn-sm py-0"
                            data-target-product-id="${item.productId}" data-target-color="${item.color}">
                                <i class="fas fa-minus"></i>
                            </button>

                        </div>
                    </span>
                </div>
            </form>
        </td>              
        <td>
            <button type="button" class="btn text-secondary deleteButton" 
             data-target-product-id="${item.productId}" data-target-color="${item.color}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>`

    // Add callbacks to the different buttons of the row
    newRow.querySelector(".quantityMinusButton").addEventListener("click",decreaseQuantity);
    newRow.querySelector(".quantityPlusButton").addEventListener("click",increaseQuantity);
    newRow.querySelector(".deleteButton").addEventListener("click",deleteItem);

    return newRow;
}


/**
 * Build the HTML structure and content of the total row of the items table.
 * @return {HTMLDivElement} - HTML element ready to display.
 */
 function buildTotalRow(){
    let newRow=document.createElement("tr");

    // calculate total price of the cart
    let totalPrice = cart.getTotalPrice();

    newRow.innerHTML=
        `<td class="d-none d-sm-table-cell"></td>
        <td></td>
        <td class="text-nowrap font-weight-bold">Total :</td>
        <td id="total-price" class="text-nowrap text-success font-weight-bold">${formatPrice(totalPrice)}</td>
        <td></td>
        <td></td>`

    return newRow;
}


/**
 * Updates the total price of the cart in the last row of the table.
 */function updateDisplayedTotalPrice(){
    // calculate total price of the cart
    let totalPrice = cart.getTotalPrice();

    // Modify the displayed value
    document.getElementById("total-price").innerHTML=formatPrice(totalPrice);
}


/**
 * Adds a new row to the table of items in the DOM.
 * @param {CartItem} item The item to add to the table.
 */
function addItemToTable(item){
    let newItemRow=buildItemRow(item);
    document.getElementsByTagName("tbody")[0].appendChild(newItemRow);
}


/**
 * Adds the last row to the table of items in the DOM.
 * This last row contains the total price of the order.
 */
 function addTotalToTable(){
    let newTotalRow=buildTotalRow();
    document.getElementsByTagName("tbody")[0].appendChild(newTotalRow);
}

/**
 * Refresh the content of the table.
 */
 function refreshTable(){
    document.getElementsByTagName("tbody")[0].innerHTML = "";
    buildTable();
}




/**
 * Builds the table. First add a row for each item in the cart.
 * Then when all the items of the cart have been processed,
 * it adds a row with total price of the cart.
 */
 function buildTable(){
    for(item of cart){
        addItemToTable(item);
    }
    addTotalToTable();
}




const cart=new Cart();
buildTable();

