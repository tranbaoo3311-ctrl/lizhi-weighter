// pages/product_detail/product_detail.js
const app = getApp()

Page({
  data: {
    product: null,
    isLoading: true,
  },
  onLoad(options) {
    const productId = options.id;
    if (productId) {
      this.fetchProductDetail(productId);
    } else {
      wx.showToast({
        title: '商品ID不存在',
        icon: 'none'
      });
      this.setData({ isLoading: false });
    }
  },

  fetchProductDetail(id) {
    this.setData({ isLoading: true });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/products/${id}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            product: res.data
          });
        } else {
          wx.showToast({
            title: `加载失败: ${res.statusCode}`,
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('Failed to fetch product detail:', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ isLoading: false });
      }
    })
  },

  addToCart() {
    if (!this.data.product) return;

    const productToAdd = this.data.product;
    const cart = wx.getStorageSync('cart') || [];

    // Check if product is already in cart
    const existingProductIndex = cart.findIndex(item => item.id === productToAdd.id);

    if (existingProductIndex > -1) {
      // Product exists, increment quantity
      cart[existingProductIndex].quantity += 1;
    } else {
      // Product does not exist, add it to cart
      cart.push({
        id: productToAdd.id,
        name: productToAdd.name,
        retail_price: productToAdd.retail_price,
        unit: productToAdd.unit,
        quantity: 1
      });
    }

    wx.setStorageSync('cart', cart);

    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  }
})
