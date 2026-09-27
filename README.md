# Product Shopping Cart

A vanilla JavaScript **Product Shopping Cart** application built using **HTML, CSS, and JavaScript**.

The application fetches products from the **Fake Store API**, displays them dynamically, provides product searching/filtering/sorting, allows users to view product details, and manages a shopping cart with quantity controls and price calculations.

---

# Features

* Fetch products from an external REST API
* Dynamically render products
* Product details modal
* Add products to shopping cart
* Prevent duplicate cart products
* Increase product quantity
* Decrease product quantity
* Remove products from cart
* Calculate individual product totals
* Calculate total cart price
* Count products in cart
* Search products by name
* Filter products by category
* Filter products by minimum price
* Filter products by maximum price
* Sort products by:

  * Name
  * Price
  * Rating
* Display products in batches
* Navigate between product batches
* Handle API errors
* Handle empty search/filter results
* Validate product quantity

---

# Technologies

* HTML5
* CSS3
* JavaScript ES6+
* Fetch API
* Fake Store API
* DOM Manipulation
* Array Methods
* Template Literals
* Async/Await
* REST API

---

# External API

Products are retrieved from:

```text
https://fakestoreapi.com/products
```

The application uses the JavaScript `fetch()` API to communicate with the external API.

---

# Application Data

The application maintains three main variables:

```js
var products = [];

var shopping_products = [];

let chunks = [];
```

## `products`

Stores all products retrieved from the API.

```js
products = await getProducts();
```

Example structure:

```js
[
    {
        id: 1,
        title: "Fjallraven Backpack",
        price: 109.95,
        description: "...",
        category: "men's clothing",
        image: "...",
        rating: {
            rate: 3.9,
            count: 120
        }
    }
]
```

---

## `shopping_products`

Stores the products currently inside the shopping cart.

Each cart product contains the original product information plus:

```js
quantity
```

Example:

```js
{
    id: 1,
    title: "Laptop",
    price: 500,
    quantity: 3
}
```

---

## `chunks`

Stores products divided into smaller batches.

```js
chunks.push(products.slice(i, i + 4));
```

Each chunk contains up to **4 products**.

Example:

```js
[
    [product1, product2, product3, product4],
    [product5, product6, product7, product8],
    [product9, product10, product11, product12]
]
```

---

# 1. Fetch Products

## Function

```js
async function getProducts()
```

### Purpose

Fetches all products from the Fake Store API.

### Request

```http
GET https://fakestoreapi.com/products
```

### Implementation

```js
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

        console.error(
            "Error fetching products:",
            error
        );

        return [];
    }
}
```

### Error Handling

If the request fails:

```js
return [];
```

This prevents the application from crashing.

---

# 2. Load Products

The application waits until the DOM has finished loading:

```js
document.addEventListener(
    "DOMContentLoaded",
    async function () {
```

Then it fetches the products:

```js
products = await getProducts();
```

---

# 3. Split Products Into Chunks

Products are divided into groups of **4**:

```js
for (let i = 0; i < products.length; i += 4) {

    chunks.push(
        products.slice(i, i + 4)
    );

}
```

Example:

```text
Products:
1  2  3  4  5  6  7  8  9  10

Chunks:

Chunk 0 → 1  2  3  4
Chunk 1 → 5  6  7  8
Chunk 2 → 9  10
```

The first chunk is displayed initially:

```js
displayProducts(chunks[0]);
```

---

# 4. Display Products

## Function

```js
displayProducts(productsToDisplay)
```

### Purpose

Dynamically creates HTML elements for each product.

The function receives an array:

```js
displayProducts(productsToDisplay);
```

Then:

```js
productsToDisplay.forEach(product => {
```

creates a product card.

---

## Product Card

Each product displays:

* Image
* Title
* Description
* Price
* Quantity input
* View Details button
* Add to Cart button

Example structure:

```html
<div class="product">

    <img src="..." alt="Product">

    <h3>Product Name</h3>

    <p>Product description</p>

    <h2>$100</h2>

    <input
        type="number"
        min="1"
        placeholder="Quantity"
    >

    <button>
        View Details
    </button>

    <button>
        Add to Cart
    </button>

</div>
```

---

# 5. View Product Details

## Function

```js
view_product(id)
```

### Purpose

Finds a product by its ID and displays its details inside a modal.

The product is searched using:

```js
const product =
    products.find(
        product => product.id == id
    );
```

If the product doesn't exist:

```js
if (!product) {
    return;
}
```

The modal is then opened:

```js
openModalToAdd();
```

And its content is dynamically generated.

---

# 6. Product Modal

The modal displays:

* Product image
* Product title
* Full description
* Price
* Quantity input
* Buy Now button
* Back button

The Buy Now button calls:

```js
addToCart(product.id);
```

The Back button calls:

```js
openModalToAdd();
```

---

# 7. Open / Close Modal

## Function

```js
openModalToAdd()
```

The function checks the current display state:

```js
if (view_product_modal.style.display === "none") {

    view_product_modal.style.display = "block";

} else {

    view_product_modal.style.display = "none";

}
```

Therefore, the same function is used to:

* Open the modal
* Close the modal

---

# 8. Add Product To Cart

## Function

```js
addToCart(id)
```

### Workflow

```text
Product ID
    ↓
Find quantity input
    ↓
Read quantity
    ↓
Validate quantity
    ↓
Check whether product exists in cart
    ↓
 ┌───────────────┐
 │ Already exists│
 └───────┬───────┘
         ↓
 Increase quantity

OR

 ┌─────────────────┐
 │ Doesn't exist   │
 └────────┬────────┘
          ↓
 Add new product
          ↓
 Render Cart
```

---

## Get Quantity

```js
const quantityInput =
    document.getElementById(`${id}`);
```

Then:

```js
const quantity =
    Number(quantityInput.value);
```

---

## Validate Quantity

```js
if (
    quantity <= 0 ||
    isNaN(quantity)
) {

    alert(
        "Please enter a valid quantity."
    );

    openModalToAdd();

    return;
}
```

The user must provide a valid positive quantity.

---

# 9. Prevent Duplicate Products

Before adding a product, the application checks:

```js
const existingProduct =
    shopping_products.find(
        product => product.id == id
    );
```

If the product already exists:

```js
existingProduct.quantity += quantity;
```

Instead of creating another cart entry.

Example:

```text
Before:

Laptop × 2

User adds:

Laptop × 3

After:

Laptop × 5
```

---

# 10. Add New Product

If the product doesn't already exist:

```js
const product =
    products.find(
        product => product.id == id
    );
```

Then a new object is created:

```js
const shop_product = {
    ...product,
    quantity: quantity
};
```

The spread operator:

```js
...product
```

copies the original product properties.

Then:

```js
shopping_products.push(shop_product);
```

adds it to the cart.

---

# 11. Render Shopping Cart

## Function

```js
renderCart()
```

### Responsibilities

The function:

1. Clears the existing cart HTML.
2. Creates the cart table header.
3. Loops through cart products.
4. Calculates each product's total.
5. Calculates the total cart price.
6. Counts cart products.
7. Creates quantity control buttons.

---

# Cart Table

The cart displays:

| Column       | Description                |
| ------------ | -------------------------- |
| Image        | Product image              |
| Name         | Product name               |
| Price        | Product unit price         |
| Quantity     | Current quantity           |
| Total Price  | Price × quantity           |
| Cancel Order | Remove product             |
| Quantity     | Increase/decrease controls |

---

# 12. Calculate Product Total

For every cart product:

```js
const totalPrice =
    shop_product.quantity *
    shop_product.price;
```

Example:

```text
Price = $100

Quantity = 3

Total = $300
```

---

# 13. Calculate Total Cart Price

The application accumulates all product totals:

```js
totalCartPrice +=
    Number(totalPrice);
```

Example:

```text
Product A → $100
Product B → $200
Product C → $50

Total Cart Price → $350
```

---

# 14. Count Cart Products

The application counts the number of different products in the cart:

```js
NoOfCartProducts += 1;
```

Then:

```js
noOfProducts.innerHTML =
    `No.of products : ${NoOfCartProducts}`;
```

### Important

This counts **different cart products**, not the total quantity.

Example:

```text
Laptop × 3
Mouse × 2
Keyboard × 1
```

The displayed number is:

```text
No.of products: 3
```

not:

```text
6
```

---

# 15. Remove Product From Cart

## Function

```js
cancelOrder(id)
```

The product is removed using `filter()`:

```js
shopping_products =
    shopping_products.filter(
        product => product.id !== id
    );
```

Then the cart is refreshed:

```js
renderCart();
```

### Example

Before:

```text
Laptop
Mouse
Keyboard
```

After removing Mouse:

```text
Laptop
Keyboard
```

---

# 16. Increase Product Quantity

## Function

```js
increase(id)
```

The function searches for the product:

```js
shopping_products.forEach(product => {

    if (product.id == id) {

        product.quantity += 1;

    }

});
```

Example:

```text
Before:
Laptop × 2

Click +

After:
Laptop × 3
```

The cart is then refreshed:

```js
renderCart();
```

---

# 17. Decrease Product Quantity

## Function

```js
decrease(id)
```

The quantity is decreased by one.

```js
product.quantity -= 1;
```

However, the application prevents the quantity from becoming zero:

```js
if (product.quantity < 2) {
    return;
}
```

Therefore:

```text
1 → cannot decrease
2 → 1
3 → 2
4 → 3
```

---

# 18. Search Products By Name

## Function

```js
filterProducts()
```

The application reads the product name from:

```js
document
    .getElementById("productName")
    .value
```

The input is normalized:

```js
.trim()
.toLowerCase();
```

Then:

```js
filteredProducts =
    filteredProducts.filter(
        product =>
            product.title
                .toLowerCase()
                .includes(productName)
    );
```

This makes the search:

* Case-insensitive
* Partial-match based

### Example

Searching:

```text
lap
```

can match:

```text
Laptop
Gaming Laptop
Laptop Bag
```

because:

```js
"laptop".includes("lap")
```

returns:

```text
true
```

---

# 19. Category Filtering

The application supports category filtering.

Available logical categories:

```text
all
men
clothes
electronic
```

The mapping is:

| UI Value     | API Category       |
| ------------ | ------------------ |
| `men`        | `men's clothing`   |
| `clothes`    | `women's clothing` |
| `electronic` | `electronics`      |
| `all`        | All categories     |

---

## Men's Clothing

```js
product.category === "men's clothing"
```

---

## Women's Clothing

```js
product.category === "women's clothing"
```

---

## Electronics

```js
product.category === "electronics"
```

---

# 20. Minimum Price Filter

The minimum price is retrieved from:

```js
document
    .getElementById("min")
    .value;
```

Then:

```js
filteredProducts =
    filteredProducts.filter(
        product =>
            product.price >=
            Number(minPrice)
    );
```

Example:

```text
Minimum price = 50
```

Products below `$50` are removed.

---

# 21. Maximum Price Filter

The maximum price is retrieved from:

```js
document
    .getElementById("max")
    .value;
```

Then:

```js
filteredProducts =
    filteredProducts.filter(
        product =>
            product.price <=
            Number(maxPrice)
    );
```

Example:

```text
Maximum price = 200
```

Products above `$200` are removed.

---

# 22. Multiple Filters

All filters can be combined.

For example:

```text
Name:
laptop

Category:
electronics

Minimum:
100

Maximum:
1000
```

The application applies them sequentially:

```text
All Products
     ↓
Name Filter
     ↓
Category Filter
     ↓
Minimum Price
     ↓
Maximum Price
     ↓
Sorting
     ↓
Display Results
```

This allows multiple conditions to work together.

---

# 23. Sorting

The application supports three sorting modes.

## Sort By Name

```js
filteredProducts.sort(
    (a, b) =>
        a.title.localeCompare(b.title)
);
```

Sorts alphabetically.

```text
Keyboard
Laptop
Monitor
Mouse
```

---

## Sort By Price

```js
filteredProducts.sort(
    (a, b) =>
        a.price - b.price
);
```

Sorts from lowest to highest price.

```text
$20
$50
$100
$500
```

---

## Sort By Rating

```js
filteredProducts.sort(
    (a, b) =>
        b.rating.rate -
        a.rating.rate
);
```

Sorts from highest rating to lowest rating.

```text
5.0
4.8
4.5
4.1
```

---

# 24. Empty Search Results

If no products match the current filters:

```js
if (productsToDisplay.length === 0) {
```

The application displays:

```text
No products found.
```

Instead of displaying an empty page.

---

# 25. Product Description Preview

The product description is shortened before displaying it in the product card:

```js
product.description.slice(
    0,
    product.description.search(/[.!?]/) + 1
)
```

The regular expression:

```js
/[.!?]/
```

searches for:

* `.`
* `!`
* `?`

The description is then displayed until the first sentence-ending punctuation.

---

# 26. Product Pagination / Chunk Navigation

Products are divided into groups:

```js
chunks
```

Each chunk contains four products.

The application can display a specific chunk:

```js
function DisplayChunk(batchIndex) {

    displayProducts(
        chunks[batchIndex]
    );

}
```

Example:

```js
DisplayChunk(0);
```

displays the first batch.

```js
DisplayChunk(1);
```

displays the second batch.

---

# 27. Next Button

The `next()` function changes the available pagination buttons.

It creates:

```html
<button onclick="DisplayChunk(3)">
    4
</button>

<button onclick="DisplayChunk(4)">
    5
</button>
```

This allows the user to navigate to later product batches.

---

# 28. Previous Button

The `previous()` function creates:

```html
<button onclick="DisplayChunk(1)">
    2
</button>

<button onclick="DisplayChunk(2)">
    3
</button>
```

This allows navigation back to earlier product batches.

---

# JavaScript Concepts Demonstrated

This project demonstrates several important JavaScript concepts.

## Variables

```js
var products = [];

let chunks = [];
```

---

## Functions

```js
function renderCart() {
    // ...
}
```

---

## Async / Await

```js
const response = await fetch(url);
```

---

## Promises

```js
fetch(...)
```

returns a Promise.

---

## Array Methods

### `find()`

```js
products.find(
    product => product.id == id
);
```

Used to find one product.

### `filter()`

```js
products.filter(
    product => product.price <= 100
);
```

Used to return multiple matching products.

### `forEach()`

```js
products.forEach(
    product => {}
);
```

Used to iterate through products.

### `sort()`

```js
products.sort(
    (a, b) => a.price - b.price
);
```

Used to sort products.

### `slice()`

```js
products.slice(0, 4);
```

Used to extract a section of an array.

---

# JavaScript Operators Used

## Spread Operator

```js
const shop_product = {
    ...product,
    quantity: quantity
};
```

Copies the product properties into a new object.

---

## Arrow Functions

```js
product => product.id == id
```

and:

```js
(a, b) => a.price - b.price
```

---

## Template Literals

```js
`$${product.price}`
```

and:

```js
`
    <h3>${product.title}</h3>
`
```

---

# Application Architecture

```text
                Fake Store API
                      │
                      │ GET /products
                      ▼
                getProducts()
                      │
                      ▼
                  products[]
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
       Display     Filtering    Chunks
       Products    & Sorting   Pagination
          │
          ▼
    Product Details
          │
          ▼
      addToCart()
          │
          ▼
   shopping_products[]
          │
          ▼
     renderCart()
          │
      ┌───┴────┐
      │        │
      ▼        ▼
   Increase  Decrease
      │        │
      └───┬────┘
          ▼
      Cart Total
```

---

# User Flow

```text
Open Application
       ↓
Fetch Products
       ↓
Display Products
       ↓
 ┌─────┼───────────────┐
 │     │               │
 ▼     ▼               ▼
Search Filter        View Details
 │     │               │
 └─────┴───────┐       │
               ▼       ▼
            Results  Add To Cart
                        │
                        ▼
                  Shopping Cart
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
          Increase   Decrease    Remove
             │          │          │
             └──────────┴──────────┘
                        │
                        ▼
                  Re-render Cart
```

---

# Important DOM Elements

The JavaScript expects several HTML elements to exist.

| Element ID           | Purpose              |
| -------------------- | -------------------- |
| `products`           | Product container    |
| `cart_products`      | Shopping cart table  |
| `noOfProducts`       | Cart product count   |
| `totalPrice`         | Total cart price     |
| `view_product_modal` | Product modal        |
| `modal_product`      | Modal content        |
| `productName`        | Product search input |
| `category`           | Category filter      |
| `min`                | Minimum price        |
| `max`                | Maximum price        |
| `sortType`           | Sorting selection    |
| `currentTabs`        | Pagination controls  |

If these IDs don't exist in the HTML, the related JavaScript functionality will not work correctly.

---

# Main Functions

| Function            | Responsibility                 |
| ------------------- | ------------------------------ |
| `getProducts()`     | Fetch products from API        |
| `view_product()`    | Show product details           |
| `openModalToAdd()`  | Open/close modal               |
| `addToCart()`       | Add product to cart            |
| `renderCart()`      | Render shopping cart           |
| `cancelOrder()`     | Remove product                 |
| `filterProducts()`  | Filter and sort products       |
| `displayProducts()` | Render product cards           |
| `increase()`        | Increase quantity              |
| `decrease()`        | Decrease quantity              |
| `DisplayChunk()`    | Display selected product batch |
| `next()`            | Navigate forward               |
| `previous()`        | Navigate backward              |

---

# Example Shopping Cart State

After adding products:

```js
shopping_products = [
    {
        id: 1,
        title: "Laptop",
        price: 500,
        quantity: 2
    },
    {
        id: 2,
        title: "Mouse",
        price: 50,
        quantity: 1
    }
];
```

The cart calculates:

```text
Laptop:
500 × 2 = $1000

Mouse:
50 × 1 = $50

----------------
Total = $1050
```

---

# Error Handling

The API request is protected with:

```js
try {
    // request
}
catch (error) {
    // handle error
}
```

If the API request fails:

```js
console.error(
    "Error fetching products:",
    error
);
```

and:

```js
return [];
```

The application therefore fails gracefully instead of terminating the JavaScript execution.

---

# Future Improvements

Possible improvements include:

* Persistent cart using `localStorage`
* Product quantity validation
* Cart checkout
* Product pagination generated dynamically
* Loading indicator
* Better error messages
* Debounced product search
* Product details page
* Product favorites/wishlist
* Authentication
* Backend API
* Database integration
* User accounts
* Order history
* Payment integration
* Responsive UI
* Better accessibility
* TypeScript migration
* Modular JavaScript architecture

---

# Learning Objectives

This project is useful for practicing:

### JavaScript

* ES6+
* Functions
* Objects
* Arrays
* Array methods
* Destructuring
* Spread operator
* Template literals
* Arrow functions
* Async/Await
* Promises
* Error handling

### DOM

* `getElementById()`
* `querySelector()`
* `innerHTML`
* Event handling
* Dynamic HTML generation
* DOM state management

### APIs

* HTTP GET requests
* Fetch API
* JSON
* REST API concepts
* API error handling

### E-Commerce Logic

* Product listing
* Searching
* Filtering
* Sorting
* Cart management
* Quantity management
* Price calculations

---

# Project Summary

This project implements a complete client-side product shopping experience using vanilla JavaScript.

The main data flow is:

```text
API
 ↓
Fetch
 ↓
products[]
 ↓
Search / Filter / Sort
 ↓
Product Display
 ↓
Product Details
 ↓
Shopping Cart
 ↓
Quantity Management
 ↓
Price Calculation
```

It demonstrates how JavaScript can be used to build an interactive frontend application without relying on a frontend framework such as React, Angular, or Vue.
