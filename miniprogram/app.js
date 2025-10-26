// app.js
App({
  onLaunch() {
    // This is the entry point of the miniprogram.
    // We can initialize global data or check for login status here.
    console.log('App Launch');
  },
  globalData: {
    // We can store global data here, e.g., userInfo, api endpoints
    userInfo: null,
    // IMPORTANT: Change this to your backend's IP address or domain in production
    apiBaseUrl: 'http://localhost:8000'
  }
})
