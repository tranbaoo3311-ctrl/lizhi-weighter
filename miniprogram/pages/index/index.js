// pages/index/index.js
const app = getApp()

Page({
  data: {
    productList: [],
    isLoading: true,
  },
  onLoad() {
    this.fetchProducts();
  },

  fetchProducts() {
    this.setData({ isLoading: true });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/products/`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            productList: res.data
          });
        } else {
          // Show error message
          wx.showToast({
            title: `加载失败: ${res.statusCode}`,
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        // Show network error message
        console.error('Failed to fetch products:', err);
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

  navigateToDetail(event) {
    const productId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product_detail/product_detail?id=${productId}`
    });
  }
})
