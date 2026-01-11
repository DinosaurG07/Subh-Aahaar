/***********************
 * CONTACT FORM LOGIC *
 ***********************/
(function () {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        // Your existing Formspree logic stays here
        alert("Form submitted (Formspree will handle this)");
        form.reset();
    });
})();


/***********************
 * CART CORE LOGIC *
 ***********************/
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const countEl = document.getElementById("cart-count");
    if (!countEl) return;

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = totalQty;
}

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
}


/*********************************
 * ADD TO CART (STORE PAGE)
 *********************************/
document.addEventListener("click", function (e) {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;

    const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: Number(btn.dataset.price.trim())
    };

    if (!product.id || !product.price) {
        console.error("Invalid product data", product);
        return;
    }

    addToCart(product);
});


/*********************************
 * CART PAGE RENDER
 *********************************/
function renderCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!container || !totalEl) return;

    const cart = getCart();
    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalEl.textContent = "0";
        return;
    }

    cart.forEach(item => {
        total += item.price * item.qty;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price} × ${item.qty}</p>
            </div>
            <div class="cart-controls">
                <button data-action="dec" data-id="${item.id}">−</button>
                <span>${item.qty}</span>
                <button data-action="inc" data-id="${item.id}">+</button>
                <button class="cart-remove" data-action="remove" data-id="${item.id}">Remove</button>
            </div>
        `;
        container.appendChild(div);
    });

    totalEl.textContent = total;
}


/*********************************
 * CART BUTTON CONTROLS
 *********************************/
document.addEventListener("click", function (e) {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    if (!action || !id) return;

    let cart = getCart();
    const item = cart.find(p => p.id === id);
    if (!item) return;

    if (action === "inc") item.qty += 1;
    if (action === "dec") item.qty -= 1;
    if (action === "remove") cart = cart.filter(p => p.id !== id);

    cart = cart.filter(p => p.qty > 0);
    saveCart(cart);
    renderCart();
});


/*********************************
 * WHATSAPP CHECKOUT
 *********************************/
document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("btn-submit")) return;

    const cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let msg = "🛒 *New Order – Subh Aahar*\n\n";
    let total = 0;

    cart.forEach(item => {
        msg += `• ${item.name} × ${item.qty} = ₹${item.price * item.qty}\n`;
        total += item.price * item.qty;
    });

    msg += `\n*Total: ₹${total}*`;
    const phone = "918788216351"; // change later
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
});


/*********************************
 * INIT
 *********************************/
updateCartCount();
renderCart();
