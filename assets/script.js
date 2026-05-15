        // Sample Products Data
       const products = [
    { id: 1, name: "Rice 5kg", price: 250.00, image: "https://i.pinimg.com/736x/7e/ef/72/7eef7284aacd81471515ce34d2d22d3f.jpg" },
    { id: 2, name: "Chicken 1klo", price: 180.00, image: "https://i.pinimg.com/736x/8f/98/34/8f98347eecdaa8f1df5866d723207d48.jpg" },
    { id: 3, name: "Eggs 12pcs", price: 85.00, image: "https://i.pinimg.com/736x/06/7a/2c/067a2c0aa638eda14ce4e86b9a9318a9.jpg" },
    { id: 4, name: "Milk 1L", price: 95.00, image: "https://i.pinimg.com/736x/7b/88/20/7b88206ab973adf9210ca7e87ec1b762.jpg" },
    { id: 5, name: "Bread", price: 45.00, image: "https://i.pinimg.com/1200x/76/8c/2a/768c2a400d78b4f35cedf1b77d6d1796.jpg" },
    { id: 6, name: "Cooking Oil", price: 120.00, image: "https://i.pinimg.com/736x/c5/fd/4d/c5fd4d5111663d46889e6070f31b11f6.jpg" },
    { id: 7, name: "Sugar 1L", price: 75.00, image: "https://i.pinimg.com/736x/29/72/e0/2972e0504eeb356cda00ac6e7be70cd2.jpg" },
    { id: 8, name: "Coffee", price: 150.00, image: "https://i.pinimg.com/1200x/fd/33/6f/fd336fc591f79f064ad9f5194b8086fb.jpg" },
    { id: 9, name: "Toothpaste", price: 60.00, image: "https://i.pinimg.com/736x/33/a6/ee/33a6eea8677485a55a5ce1052cd86dae.jpg" },
    { id: 10, name: "Soap", price: 35.00, image: "https://i.pinimg.com/736x/11/ec/9c/11ec9c900d23a5b0e401b2a53b9dba88.jpg" },
    { id: 11, name: "Shampoo", price: 120.00, image: "https://i.pinimg.com/736x/03/80/d6/0380d6e3817562d68181f784a288ce13.jpg" },
    { id: 12, name: "Fabcon", price: 180.00, image: "https://i.pinimg.com/736x/0c/88/32/0c8832f62fc19bd4680726e6e41d8ddb.jpg" }
];

        let cart = [];
        let transactionId = 1;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            renderItems();
            updateCartDisplay();
        });

        // Render Items
        function renderItems(filter = '') {
            const itemsGrid = document.getElementById('itemsGrid');
            const filteredItems = products.filter(item => 
                item.name.toLowerCase().includes(filter.toLowerCase())
            );

            itemsGrid.innerHTML = filteredItems.map(item => `
                <div class="item-card" data-id="${item.id}">
                    <div class="item-img">
    ${
        item.image.startsWith('http')
            ? `<img src="${item.image}" alt="${item.name}">`
            : item.image
    }
</div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">₱${item.price.toFixed(2)}</div>
                </div>
            `).join('');

            // Add click events to items
            document.querySelectorAll('.item-card').forEach(card => {
                card.addEventListener('click', function() {
                    addToCart(parseInt(this.dataset.id));
                });
            });
        }

        // Search functionality
        document.getElementById('searchBox').addEventListener('input', function(e) {
            renderItems(e.target.value);
        });

        // Add to Cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            updateCartDisplay();
            showNotification(`${product.name} added to cart!`);
        }

        // Update Cart Display
        function updateCartDisplay() {
            const cartItems = document.getElementById('cartItems');
            const cartCount = document.getElementById('cartCount');
            const totalItems = document.getElementById('totalItems');
            const grandTotal = document.getElementById('grandTotal');

            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div>
                        <strong>
    <img src="${item.image}" style="width:30px;height:30px;object-fit:cover;border-radius:4px;">
    ${item.name}
</strong>
                        <small>₱${item.price.toFixed(2)} x ${item.quantity}</small>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span style="min-width: 25px; text-align: center;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
                    </div>
                </div>
            `).join('');

            const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            cartCount.textContent = totalItemCount;
            totalItems.textContent = totalItemCount;
            grandTotal.textContent = totalAmount.toFixed(2);
        }

        // Update Quantity
        function updateQuantity(index, change) {
            if (cart[index].quantity + change > 0) {
                cart[index].quantity += change;
                if (cart[index].quantity === 0) {
                    cart.splice(index, 1);
                }
                updateCartDisplay();
            }
        }

        // Remove from Cart
        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartDisplay();
        }

        // Clear Cart
        document.getElementById('clearBtn').addEventListener('click', function() {
            cart = [];
            updateCartDisplay();
            showNotification('Cart cleared!');
        });

        // Checkout and Print Receipt
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Cart is empty!');
                return;
            }

            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Generate Receipt
            generateReceipt(totalAmount);
            
            // Clear Cart
            cart = [];
            updateCartDisplay();
            
            showNotification('Receipt printed! Transaction completed.');
        });

        // Generate and Print Receipt
        function generateReceipt(totalAmount) {
            const now = new Date();
            const dateTime = now.toLocaleString('en-PH', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            document.getElementById('receiptDateTime').textContent = dateTime;
            document.getElementById('transId').textContent = `00${transactionId++}`;
            document.getElementById('receiptTotal').textContent = totalAmount.toFixed(2);

            const receiptItems = document.getElementById('receiptItems');
            receiptItems.innerHTML = cart.map(item => `
                <div class="receipt-item">
                    <span>${item.name}</span>
                    <span>${item.quantity}x ₱${item.price.toFixed(2)}</span>
                </div>
            `).join('');

            // Show receipt briefly then print
            document.getElementById('receipt').style.display = 'block';
            
            setTimeout(() => {
                window.print();
                document.getElementById('receipt').style.display = 'none';
            }, 500);
        }

        // Notification
        function showNotification(message) {
            // Simple notification (you can enhance this)
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    
