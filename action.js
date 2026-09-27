

//javascript
var products = [];
var shopping_products = [];
let chunks=[];

// ==========================================
// Fetch Products
// ==========================================

        async function getProducts() {

            try {

                const response = await fetch(
                    "https://fakestoreapi.com/products"
                );

                if (!response.ok) {
                    throw new Error("Request failed");
                }

                return await response.json();

            } catch (error) {

                console.error("Error fetching products:", error);

                return [];
            }
        }


// ==========================================
// Load Products
// ==========================================

       

        document.addEventListener("DOMContentLoaded", async function () {
            products = await getProducts();

            // splite displayed products into batches each batch size is 5 items
            

            for (let i = 0; i < products.length; i += 4) {
                        chunks.push(products.slice(i, i + 4)); // return nested array
                    }

            
            displayProducts(chunks[0]);
        });


// ==========================================
// Open / Close Product Modal
// ==========================================

        function openModalToAdd() {

            var view_product_modal =
                document.getElementById("view_product_modal");

                    if (view_product_modal.style.display === "none") {

                        view_product_modal.style.display = "block";

                    } else {

                        view_product_modal.style.display = "none";
                    }
        }


// ==========================================
// View Product Details
// ==========================================

        function view_product(id){

            var product = products.find(product => product.id == id);

            if(!product) {
                return;
            }

            openModalToAdd();

            var product_modal =
                document.getElementById("modal_product");

            product_modal.innerHTML = `
                <img 
                    src="${product.image}"
                    alt="${product.title}"
                >

                <h3 style="margin: 0 5px;">
                    ${product.title}
                </h3>

                <p>
                    ${product.description}
                </p>

                <h2 style="margin: 0;">
                    $${product.price}
                </h2>

                <br>

                <input
                    type="number"
                    min="1"
                    class="modal_input"
                    id="${product.id}"
                    placeholder="Quantity"
                >

                <br>

                <div class="div_buttons">

                    <button onclick="addToCart(${product.id})">
                        Buy Now
                    </button>

                    <button onclick="openModalToAdd()">
                        Back
                    </button>

                </div>
            `;
        }


// ==========================================
// Add Product To Cart
// ==========================================

        function addToCart(id) {

            var quantityInput =
                document.getElementById(`${id}`);

            if (!quantityInput) {
                return;
            }

            var quantity = Number(quantityInput.value);

            if (quantity <= 0 || isNaN(quantity)) {

                alert("Please enter a valid quantity.");

                openModalToAdd();

                return; // no actions becasue he did not enter the quantity
            }


            // Check if product already exists in cart

            var existingProduct =
                shopping_products.find(product => product.id == id);


            if (existingProduct) {

                existingProduct.quantity += quantity;

            } else {

                var product =
                    products.find(product => product.id == id);

                if (!product) {
                    return;
                }

                var shop_product = {
                    ...product,
                    quantity: quantity
                };

                shopping_products.push(shop_product);
            }


            // Refresh cart

            renderCart();
        }


// ==========================================
// Render Shopping Cart
// ==========================================

        function renderCart() {

            var noOfProducts = document.getElementById("noOfProducts");
            var totalPrice   = document.getElementById("totalPrice");

            
            var cart_products =
                document.getElementById("cart_products");

            cart_products.innerHTML = `
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Cancel Order</th>
                    <th>Quantity </th>
                </tr>
            `;

            let NoOfCartProducts=0;
            let totalCartPrice=0;
            shopping_products.forEach(shop_product => {

                var totalPrice =
                    shop_product.quantity * shop_product.price;
                    totalCartPrice += Number(totalPrice);
                    NoOfCartProducts +=1;
                cart_products.innerHTML += `
                    <tr>
                       
                        <td>
                            <img 
                                src="${shop_product.image}"
                                alt="${shop_product.title}"
                            >
                        </td>

                        <td>
                            ${shop_product.title}
                        </td>

                       

                        <td>
                            $${shop_product.price}
                        </td>

                        <td>
                            ${shop_product.quantity}
                        </td>

                        <td>
                            $${totalPrice.toFixed(2)}
                        </td>

                        <td>
                            <button 
                                onclick="cancelOrder(${shop_product.id})"
                            >
                                Cancel
                            </button>
                        </td>

                        <td>
                            <button class="quantityButtons" onclick="increase(${shop_product.id})">+</button><br>
                            <button class="quantityButtons" onclick="decrease(${shop_product.id})">-</button>
                        </td>

                    </tr>
                `;
            }        
        );

        noOfProducts.innerHTML =`No.of products : ${NoOfCartProducts}`;
        totalPrice.innerHTML =`Total price : ${totalCartPrice}`;


        }


// ==========================================
// Remove Product From Cart
// ==========================================

        function cancelOrder(id) {

            shopping_products =
                shopping_products.filter(
                    product => product.id !== id
                );

            renderCart();// refresh shoppign cart
        }

//  =============================================
//  filtering based on passed conditions
//  =============================================


        function filterProducts() {

            // ==========================================
            // Get filter values
            // ==========================================

            const productName =
                document.getElementById("productName").value
                    .trim()
                    .toLowerCase();

            const category =
                document.getElementById("category").value;

            const minPrice =
                document.getElementById("min").value;

            const maxPrice =
                document.getElementById("max").value;

            const sortType =
                document.getElementById("sortType").value;


            // ==========================================
            // Start with a copy of products
            // ==========================================

            let filteredProducts = [...products];


            // ==========================================
            // Search by product name
            // ==========================================

            if (productName !== "") {

                filteredProducts = filteredProducts.filter(product =>
                    product.title.toLowerCase().includes(productName)
                );
            }


            // ==========================================
            // Filter by category
            // ==========================================

            if (category !== "all") {

                if (category === "men") {

                    filteredProducts = filteredProducts.filter(product =>
                        product.category === "men's clothing"
                    );

                } else if (category === "clothes") {

                    filteredProducts = filteredProducts.filter(product =>
                        product.category === "women's clothing"
                    );

                } else if (category === "electronic") {

                    filteredProducts = filteredProducts.filter(product =>
                        product.category === "electronics"
                    );
                }
            }


            // ==========================================
            // Minimum Price
            // ==========================================

            if (minPrice !== "") {

                filteredProducts = filteredProducts.filter(product =>
                    product.price >= Number(minPrice)
                );
            }


            // ==========================================
            // Maximum Price
            // ==========================================

            if (maxPrice !== "") {

                filteredProducts = filteredProducts.filter(product =>
                    product.price <= Number(maxPrice)   // take lambada expression
                );
            }


            // ==========================================
            // Sorting
            // ==========================================

            if (sortType === "name") {

                filteredProducts.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );

            } else if (sortType === "price") {

                filteredProducts.sort((a, b) =>
                    a.price - b.price
                );

            } else if (sortType === "rate") {

                filteredProducts.sort((a, b) =>
                    b.rating.rate - a.rating.rate
                );
            }


            // ==========================================
            // Display results
            // ==========================================

            displayProducts(filteredProducts);
        }


// ==========================================
// Display Products
// ==========================================

        function displayProducts(productsToDisplay) {

            const productsContainer =
                document.getElementById("products");

            productsContainer.innerHTML = "";


            if (productsToDisplay.length === 0) {

                productsContainer.innerHTML = `
                    <p class="no-products">
                        No products found.
                    </p>
                `;

                return;
            }

           
            productsToDisplay.forEach(product => {
                
                productsContainer.innerHTML += `
                    <div class="product">

                        <img
                            src="${product.image}"
                            alt="${product.title}"
                        >

                        <h3 style="margin: 0 5px;">
                            ${product.title}
                        </h3>

                        <p>
                            
                            ${product.description.slice(0, product.description.search(/[.!?]/) + 1)}
                        </p>

                        <h2 style="margin: 0;">
                            $${product.price}
                        </h2>

                        
                        <br>

                        <input
                            type="number"
                            min="1"
                            required
                            id="${product.id}"
                            placeholder="Quantity"
                        >

                        <br>

                        <div class="div_buttons">

                            <button
                                onclick="view_product(${product.id})">
                                View Details
                            </button>

                            <button
                                onclick="addToCart(${product.id})">
                                Add to Cart
                            </button>

                        </div>

                    </div>
                `;

                
            });
        }

// ==========================================
// Increase cart's product quantity
// ==========================================

        function increase(id){

            shopping_products.forEach(product =>{
                if(product.id == id){
                    product.quantity +=1;
                    product.totalPrice =product.price * product.quantity;
                }
            })

            renderCart()

        }


// ==========================================
// Decrease cart's prodct quantity
// ==========================================

        function decrease(id){
            shopping_products.forEach(product =>{
                if(product.id == id){
                    if(product.quantity < 2){
                        return;
                    }
                    product.quantity -=1;
                    product.totalPrice =product.price * product.quantity;
                }
            })

            renderCart()

        }

        function DisplayChunk(batchIndex){
            displayProducts(chunks[batchIndex]);
        }

        function next(){
            let currentTabs=document.getElementById("currentTabs");
            currentTabs.innerHTML=``
            
            
                    currentTabs.innerHTML =
                    `
                            <button onclick="DisplayChunk(3)">
                                4
                            </button>

                            <button onclick="DisplayChunk(4)">
                                5
                            </button>

                    
                    `
            }



        

        function previous(){
            let currentTabs=document.getElementById("currentTabs");
            currentTabs.innerHTML=``
            currentTabs.innerHTML =`
                       <button onclick="DisplayChunk(1)">
                            2
                        </button>

                        <button onclick="DisplayChunk(2)">
                            3
                        </button>

                `

        }

