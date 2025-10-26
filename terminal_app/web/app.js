// Global configuration
const API_BASE_URL = 'http://localhost:8000'; // IMPORTANT: Change this to your backend's IP address or domain in production

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        showMainApp();
    }
});

async function handleLogin(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('accessToken', data.access_token);
            showMainApp();
        } else {
            const error = await response.json();
            alert(`登录失败: ${error.detail || '未知错误'}`);
        }
    } catch (error) {
        console.error('Login request failed:', error);
        alert('登录请求失败，请检查网络连接。');
    }
}

function showMainApp() {
    document.getElementById('login-screen').style.display = 'none';
    const mainApp = document.getElementById('main-app');
    mainApp.style.display = 'flex';
    fetchOrders();
}

function handleLogout() {
    sessionStorage.removeItem('accessToken');
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

async function fetchOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/`);
        if (response.ok) {
            const orders = await response.json();
            renderOrderList(orders);
        } else {
            alert('获取订单列表失败。');
        }
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        alert('网络错误，无法获取订单列表。');
    }
}

function renderOrderList(orders) {
    const container = document.getElementById('order-list-container');
    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<p>没有待处理的订单。</p>';
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-list-item';
        orderElement.innerHTML = `
            <p><strong>订单号: ${order.id}</strong></p>
            <p>客户ID: ${order.customer_id}</p>
            <p>状态: <span class="status-${order.status}">${order.status}</span></p>
        `;
        orderElement.addEventListener('click', () => fetchOrderDetail(order.id));
        container.appendChild(orderElement);
    });
}

async function fetchOrderDetail(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        if (response.ok) {
            const orderDetail = await response.json();
            renderOrderDetail(orderDetail);
        } else {
            alert('获取订单详情失败。');
        }
    } catch (error) {
        console.error('Failed to fetch order detail:', error);
        alert('网络错误，无法获取订单详情。');
    }
}

function renderOrderDetail(order) {
    const container = document.getElementById('order-detail-container');
    container.innerHTML = `
        <h3>订单 #${order.id}</h3>
        <p><strong>客户ID:</strong> ${order.customer_id}</p>
        <p><strong>总金额:</strong> ¥${order.total_amount.toFixed(2)}</p>
        <p><strong>状态:</strong> ${order.status}</p>
        <h4>商品列表:</h4>
    `;

    const itemList = document.createElement('div');
    itemList.className = 'order-item-list';

    order.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span>商品ID ${item.product_id} (x${item.quantity})</span>
            <button>称重 & 打印</button>
        `;
        itemElement.querySelector('button').addEventListener('click', () => {
            alert(`模拟打印标签：\n客户ID: ${order.customer_id}\n商品ID: ${item.product_id}\n数量: ${item.quantity}`);
        });
        itemList.appendChild(itemElement);
    });

    container.appendChild(itemList);

    if (order.status !== 'completed') {
        const completeButton = document.createElement('button');
        completeButton.className = 'complete-order-btn';
        completeButton.innerText = '完成订单';
        completeButton.addEventListener('click', () => completeOrder(order.id));
        container.appendChild(completeButton);
    }
}

async function completeOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        });

        if (response.ok) {
            alert('订单已完成！');
            fetchOrders(); // Refresh the order list
            document.getElementById('order-detail-container').innerHTML = '<p class="placeholder-text">请从左侧选择一个订单</p>';
        } else {
            alert('更新订单状态失败。');
        }
    } catch (error) {
        console.error('Failed to complete order:', error);
        alert('网络错误，无法完成订单。');
    }
}
