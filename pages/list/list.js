const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

Page({
  data: {
    city: '',
    weekWeather: []
  },
  onLoad(options) {
    this.setData({
      city: options.city
    });
    this.getWeekWeather();
  },
  onPullDownRefresh() {
    this.getWeekWeather(wx.stopPullDownRefresh);
  },
  getWeekWeather(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future/',
      data: {
        city: this.data.city,
        time: new Date().getTime()
      },
      success: res => {
        let result = res.data.result;
        this.setWeekWeather(result);
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  setWeekWeather(result) {
    let weekWeather = [];
    for (let i = 0; i < result.length; i++) {
      let date = new Date();
      date.setDate(date.getDate() + i);
      weekWeather.push({
        day: dayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        temp: `${result[i].minTemp}° - ${result[i].maxTemp}°`,
        iconPath: `/images/${result[i].weather}-icon.png`
      });
      weekWeather[0].day = "Today";
      this.setData({
        weekWeather: weekWeather
      })
    }
  }
})