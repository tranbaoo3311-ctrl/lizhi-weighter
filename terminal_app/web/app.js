document.addEventListener('DOMContentLoaded', () => {
    // Check if a token exists and switch to the main app if so
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        showMainApp();
    }
});

async function handleLogin(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    const errorMessage = document.getElementById('login-error');

    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch('http://localhost:8000/token', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
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
        alert('登录请求失败，请检查网络连接或联系管理员。');
    }
}

function showMainApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
}

function handleLogout() {
    sessionStorage.removeItem('accessToken');
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}
