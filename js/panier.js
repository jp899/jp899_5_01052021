/**
 * Callback for minus button.
 * Decrease the quantity displayed and updates the cart.
 * @param {Event} event - Event that triggered the callback.
 */
 function decreaseQuantityOfRow(event){
    event.preventDefault();
    // Get the info to locate the row in wich the button has been clicked.
    let productId = event.currentTarget.dataset.targetProductId;
    let color = event.currentTarget.dataset.targetColor;

    // If the cart has been modified by another page, refresh the cart and the table
    if (cart.hasChanged()){
        cart.getFromLocalStorage();
        buildTable();
    }

    // Get the row in wich the button has been clicked.
    let currentRow = document.querySelector(`[data-product-id="${productId}"][data-color="${color}"]`);

    if(currentRow !== null){
        // Get the current quantity of the item.
        let quantity = parseInt(currentRow.querySelector(".article-quantity").value);

        // // Can't go lower than 1.
        if(quantity > 1){
            currentRow.querySelector(".article-quantity").value = quantity-1;
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
 function increaseQuantityOfRow(event){
    event.preventDefault();

    // Get the info to locate the row in wich the button has been clicked.
    let productId = event.currentTarget.dataset.targetProductId;
    let color = event.currentTarget.dataset.targetColor;

    // If the cart has been modified by another page, refresh the cart and the table
    if (cart.hasChanged()){
        cart.getFromLocalStorage();
        buildTable();
    }

    // Get the row in wich the button has been clicked.
    let currentRow = document.querySelector(`[data-product-id="${productId}"][data-color="${color}"]`);

    if(currentRow !== null){
        // Get the current quantity of the item.
        let quantity = parseInt(currentRow.querySelector(".article-quantity").value);

        currentRow.querySelector(".article-quantity").value = quantity+1;
        cart.increaseQuantityOfItem(productId,color);
        updateDisplayedTotalPrice();
    }
}

/**
 * Callback for delete button.
 * Removes the item from the displayed table and from the cart
 * @param {Event} event - Event that triggered the callback.
 */
 function deleteItemOfRow(event){
    event.preventDefault();

    // Get the info to locate the row in wich the button has been clicked.
    let productId = event.currentTarget.dataset.targetProductId;
    let color = event.currentTarget.dataset.targetColor;

    // If the cart has been modified by another page, refresh the cart and the table
    if (cart.hasChanged()){
        cart.getFromLocalStorage();
        buildTable();
    }

    // Get the row in wich the button has been clicked.
    let currentRow = document.querySelector(`[data-product-id="${productId}"][data-color="${color}"]`);

    if(currentRow !== null){
        currentRow.remove();
        cart.removeItem(productId,color);
        if(cart.isEmpty()){
            buildTable();
        }
        else{
            updateDisplayedTotalPrice();
        }
    }

}


/**
 * Build the HTML structure and content of a row of the items table.
 * @param {Object} item - Item to add.
 * @return {HTMLDivElement} - HTML element ready to display.
 */
 function buildItemRow(item){
    let newRow = document.createElement("tr");
    // Add data attributes to the row, to ease identification of each row
    newRow.dataset.productId = item.productId;
    newRow.dataset.color = item.color;

    newRow.innerHTML =
        `<td class="d-none d-sm-table-cell">
            <img src="${item.imageUrl}" class="img-fluid img-cart-item" alt="Photo d'ours en peluche">
        </td>
        <td><a href="produit.html?productId=${item.productId}">${item.name}</a></td>
        <td>${item.color}</td>
        <td class="text-nowrap">${formatPrice(item.price)}</td>
        <td class="px-0">
            <form>
                <div class="form-group form-inline">

                    <span class="input-group ml-sm-3">

                        <input type="text" name="article-quantity" 
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
    newRow.querySelector(".quantityMinusButton").addEventListener("click",decreaseQuantityOfRow);
    newRow.querySelector(".quantityPlusButton").addEventListener("click",increaseQuantityOfRow);
    newRow.querySelector(".deleteButton").addEventListener("click",deleteItemOfRow);

    return newRow;
}


/**
 * Build the HTML structure and content of the headings row of the items table.
 * @return {HTMLDivElement} - HTML element ready to display.
 */
 function buildHeadingsRow(){
    let newRow = document.createElement("tr");

    newRow.innerHTML =
        `<th scope="col" class="d-none d-sm-table-cell col-sm-2"></th>
        <th scope="col">Article</th>
        <th scope="col">Couleur</th>
        <th scope="col" >Prix</th>
        <th scope="col">Quantité</th>
        <th scope="col"></th>`

    return newRow;
}

/**
 * Build the HTML structure and content of the total row of the items table.
 * @return {HTMLDivElement} - HTML element ready to display.
 */
 function buildTotalRow(){
    let newRow = document.createElement("tr");

    // calculate total price of the cart
    let totalPrice = cart.getTotalPrice();

    newRow.innerHTML =
        `<td class="d-none d-sm-table-cell"></td>
        <td></td>
        <td class="text-nowrap font-weight-bold">Total :</td>
        <td id="total-price" class="text-nowrap text-success font-weight-bold">${formatPrice(totalPrice)}</td>
        <td></td>
        <td></td>`

    return newRow;
}

/**
 * Build the HTML structure and content of a row of the table, 
 * wich contains a message to inform the user that the cart is empty.
 * @return {HTMLDivElement} - HTML element ready to display.
 */
 function buildEmptyMessageDiv(){
    let newDiv = document.createElement("div");
    newDiv.id = "empty-message";
    newDiv.classList.add("font-weight-bold","bg-info","text-white", "h5", "text-center","py-3");

    newDiv.innerHTML =
        `Votre panier est vide.`

    return newDiv;
}


/**
 * Updates the total price of the cart in the last row of the table.
 */function updateDisplayedTotalPrice(){
    // calculate total price of the cart
    let totalPrice = cart.getTotalPrice();

    // Modify the displayed value
    document.getElementById("total-price").innerHTML = formatPrice(totalPrice);
}


/**
 * Adds a new row to the table of items in the DOM.
 * @param {CartItem} item The item to add to the table.
 */
function addItemToTable(item){
    let newItemRow = buildItemRow(item);
    document.getElementsByTagName("tbody")[0].appendChild(newItemRow);
}


/**
 * Adds the headings row to the table of items in the DOM.
 */
 function addHeadingsToTable(){
    let newHeadingsRow = buildHeadingsRow();
    document.getElementsByTagName("thead")[0].appendChild(newHeadingsRow);
}


/**
 * Adds the last row to the table of items in the DOM.
 * This last row contains the total price of the order.
 */
 function addTotalToTable(){
    let newTotalRow = buildTotalRow();
    document.getElementsByTagName("tbody")[0].appendChild(newTotalRow);
}


/**
 * Clear the content and headings of the table.
 */
 function clearTable(){
    let emptyMessage = document.getElementById("empty-message");
    if (emptyMessage !== null){
        emptyMessage.remove();
    }
    document.getElementsByTagName("thead")[0].innerHTML = "";
    document.getElementsByTagName("tbody")[0].innerHTML = "";
}


/**
 * Create a div with a message for the user to indicate that the cart is empty.
 */
 function addEmptyCartMessage(){
    let newEmptyMessageDiv = buildEmptyMessageDiv();
    let mainElement = document.getElementsByTagName("main")[0];
    let firstSectionElement = document.getElementsByTagName("section")[0];
    mainElement.insertBefore(newEmptyMessageDiv,firstSectionElement);
}


/**
 * Builds the table. First add a row for each item in the cart.
 * Then when all the items of the cart have been processed,
 * it adds a row with total price of the cart.
 */
 function buildTable(){

    clearTable();

    if(! cart.isEmpty()){
        addHeadingsToTable();
        for(item of cart){
            addItemToTable(item);
        }
        addTotalToTable();
    }
    else{
        addEmptyCartMessage();
    }
}


/**
 * Builds an object containing the user data submited in the form.
 * @return {Object} - contact data object.
 */
 function buildContactData(){
     return {firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value
        }
}


/**
 * Check if the argument is a valid name/city with a regular expression.
 * @param {string} name - The string to check.
 * @return {boolean} - true if the name/city is valid.
 */
 function isValidName(name){
    // At least 1 alpha caracter + one or more of non digit characters.
    const regex = /^[a-zA-Z]{1}[\D]+$/;
    return regex.test(name);
}


/**
 * Check if the argument is a valid physical adress with a regular expression.
 * @param {string} address - The string to check.
 * @return {boolean} - true if the address is valid.
 */
 function isValidPhysicalAddress(address){
    // At least 1 alpha/digit character + one or more of any character.
    const regex = /^[a-zA-Z0-9][\s\S]+$/;
    return regex.test(address);
}


/**
 * Check if the argument is a valid email adress with a regular expression.
 * @param {string} email - The string to check.
 * @return {boolean} - true if the address is valid.
 */
 function isValidEmail(email){
    // Same regex used to check type="email" input in HTML5.
    // Remark : it allows emails without Top Level Domain (ex : admin@mailserver1)
    //         which are rare, but possible and valid emails.
    const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(email);
}


/**
 * Validates the data submited by the user.
 * @return {boolean} - true if all fields are OK.
 */
 function userDataValidate(){
    const toCheck = ["firstName", "lastName", "email", "address", "city"];
    let allValid = true;

    for (let field of toCheck) {
      let element = document.getElementById(field);
      let feedbackMessage = document.getElementById(field + "-feedback");

      //Check if the field has been filled by the user
      if (! element.value) {
        feedbackMessage.innerHTML = "Saisie obligatoire";
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");
        allValid = false;
      }
      // City / firstName / lastName only
      else if ( (field === "firstName"
                || field === "lastName"
                || field === "city")
            && ! isValidName(element.value)) {
        feedbackMessage.innerHTML = "Saisissez au moins deux caractères valides";
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");
        allValid = false;
      }
      // Physical address only
      else if (field === "address" && ! isValidPhysicalAddress(element.value)) {
        feedbackMessage.innerHTML = "Saisissez au moins deux caractères valides";
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");
        allValid = false;
      }
      // Email only
      else if (field === "email" && ! isValidEmail(element.value)) {
        feedbackMessage.innerHTML = "Saisissez une adresse email valide";
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");
        allValid = false;
      }
      // If all controls are OK for the field
      else {
        feedbackMessage.innerHTML = "";
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
      }
    }

    return allValid;
}


/**
 * Callback for form validation button.
 * @param {Event} event - Event that triggered the callback.
 */
function validateForm(event){
    
    event.preventDefault();
    
    // Check presence/type of the input fields
    if(! userDataValidate())
    {
        return;
    }
    // If the cart has been modified by another page, refresh the cart and the table
    // Then display a modal to inform the user.
    else if (cart.hasChanged()){
        console.log("test");
        cart.getFromLocalStorage();
        buildTable();
        $("#modifiedCartModal").modal();
    }
    // If the cart is empty, display a modal to inform the user 
    // and propose to return to the product list page.
    else if (cart.isEmpty()){
        $("#emptyCartModal").modal();
    }
    // If All controls are OK : submit order to the server 
    else{
        // Create the contact object
        let contactData = buildContactData();

        // Get the list of products from the cart
        let listOfProducts = cart.getListOfProducts();

        // POST request to server
        sendOrderRequest(contactData,listOfProducts)
        .then(function(response){
            //store orderId + total price in localStorage for the confirmation page
            let orderDataString = JSON.stringify({orderId: response.orderId,
                                                totalPrice: cart.getTotalPrice()});
            localStorage.setItem("orderData",orderDataString);

            //empty the cart and empty the table
            cart.clear();
            buildTable()

            //finally navigate to the confirmation page
            window.location.href = "./confirmation.html";
        })
        .catch(function(error){
            console.log(error);
            $("#errorModal").modal();
        }); 
    }
}




const cart = new Cart();
buildTable();
document.getElementById("order-form").addEventListener("submit",validateForm);



