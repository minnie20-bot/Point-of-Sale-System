    
        let products = [];
        let cart = [];
        let transactionId = 1;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            initProducts();
            bindItemClicks();
            renderItems();
            updateCartDisplay();
        });

        function initProducts() {
            products = Array.from(document.querySelectorAll('.item-card')).map(card => ({
                id: parseInt(card.dataset.id, 10),
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                image: card.dataset.image || card.querySelector('img')?.src || ''
            }));
        }

        function bindItemClicks() {
            document.querySelectorAll('.item-card').forEach(card => {
                card.addEventListener('click', function() {
                    addToCart(parseInt(this.dataset.id, 10));
                });
            });
        }

        // Render Items
        function renderItems(filter = '') {
            const search = filter.toLowerCase();
            document.querySelectorAll('.item-card').forEach(card => {
                const name = card.dataset.name.toLowerCase();
                card.style.display = name.includes(search) ? 'block' : 'none';
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
                    <div class="cart-item-header">
                        <input type="checkbox" class="item-checkbox" data-index="${index}" checked onchange="updateTotals()">
                        <strong>
    <img src="${item.image}" style="width:30px;height:30px;object-fit:cover;border-radius:4px;">
    ${item.name}
</strong>
                        <small>₱${item.price.toFixed(2)}</small>
                    </div>
                    <div class="cart-item-controls">
                        <label>
                            Qty:
                            <select class="qty-select" onchange="setQuantity(${index}, this.value)">
                                ${Array.from({ length: 20 }, (_, i) => i + 1).map(num => `
                                    <option value="${num}" ${num === item.quantity ? 'selected' : ''}>${num}</option>
                                `).join('')}
                            </select>
                        </label>
                        <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
                    </div>
                </div>
            `).join('');

            updateTotals();
        }

        function updateTotals() {
            const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
            const checkedIndices = Array.from(checkedBoxes).map(cb => parseInt(cb.dataset.index, 10));

            const totalItemCount = checkedIndices.reduce((sum, index) => sum + cart[index].quantity, 0);
            const totalAmount = checkedIndices.reduce((sum, index) => sum + (cart[index].price * cart[index].quantity), 0);

            document.getElementById('cartCount').textContent = totalItemCount;
            document.getElementById('totalItems').textContent = totalItemCount;
            document.getElementById('grandTotal').textContent = totalAmount.toFixed(2);
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

        function setQuantity(index, value) {
            const quantity = parseInt(value, 10);
            if (quantity > 0) {
                cart[index].quantity = quantity;
            } else {
                cart.splice(index, 1);
                updateCartDisplay();
                return;
            }
            updateTotals();
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
            const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
            if (checkedBoxes.length === 0) {
                alert('Please select items to checkout!');
                return;
            }

            const checkedIndices = Array.from(checkedBoxes).map(cb => parseInt(cb.dataset.index, 10));
            const selectedItems = checkedIndices.map(index => cart[index]);

            const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Generate Receipt
            generateReceipt(selectedItems, totalAmount);

            // Remove checked items from cart
            const uncheckedIndices = Array.from({ length: cart.length }, (_, i) => i)
                .filter(i => !checkedIndices.includes(i));
            const remainingItems = uncheckedIndices.map(index => cart[index]);
            cart = remainingItems;

            updateCartDisplay();

            showNotification('Receipt printed! Transaction completed.');
        });

        // Generate and Print Receipt
        function generateReceipt(selectedItems, totalAmount) {
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
            receiptItems.innerHTML = selectedItems.map(item => {
                const itemTotal = (item.price * item.quantity).toFixed(2);
                const name = item.name.length > 15 ? item.name.substring(0, 12) + '..' : item.name;
                return `
                <div class="receipt-item">
                    <span class="receipt-item-name">${name}</span>
                    <span class="receipt-item-qty">${item.quantity}</span>
                    <span class="receipt-item-amount">₱${itemTotal}</span>
                </div>
            `}).join('');

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
    
