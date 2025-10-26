// pages/cart/cart.js
const app = getApp();

Page({
  data: {
    cart: [],
    totalPrice: 0,
    // In a real app, this would be dynamically set after user login.
    // For this MVP, you might need to set it manually for testing.
    customerId: null
  },

  onShow() {
    this.loadCartData();
  },

  loadCartData() {
    const cart = wx.getStorageSync('cart') || [];
    this.setData({ cart });
    this.calculateTotalPrice();
  },

  calculateTotalPrice() {
    const totalPrice = this.data.cart.reduce((sum, item) => {
      return sum + (item.retail_price * item.quantity);
    }, 0);
    this.setData({ totalPrice: totalPrice.toFixed(2) });
  },

  changeQuantity(event) {
    const { id, delta } = event.currentTarget.dataset;
    const cart = this.data.cart;
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
      cart[itemIndex].quantity += delta;
      if (cart[itemIndex].quantity === 0) {
        // Remove item if quantity becomes 0
        cart.splice(itemIndex, 1);
      }
      wx.setStorageSync('cart', cart);
      this.loadCartData();
    }
  },

  removeItem(event) {
    const { id } = event.currentTarget.dataset;
    let cart = this.data.cart;
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      cart.splice(itemIndex, 1);
      wx.setStorageSync('cart', cart);
      this.loadCartData();
    }
  },

  submitOrder() {
    if (this.data.cart.length === 0) {
      wx.showToast({ title: '购物车是空的', icon: 'none' });
      return;
    }

    // In a real app, we should ensure customerId is set.
    if (!this.data.customerId) {
        wx.showToast({ title: '请先登录或选择客户', icon: 'none' });
        return;
    }

    const orderItems = this.data.cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }));

    wx.showLoading({ title: '正在下单...' });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/orders/`,
      method: 'POST',
      data: {
        customer_id: this.data.customerId,
        items: orderItems
      },
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          wx.showToast({ title: '下单成功！', icon: 'success' });
          // Clear cart
          wx.removeStorageSync('cart');
          this.loadCartData();
        } else {
          wx.showToast({ title: `下单失败: ${res.data.detail || '未知错误'}`, icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('Failed to submit order:', err);
        wx.showToast({ title: '网络错误，下单失败', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  }
});
