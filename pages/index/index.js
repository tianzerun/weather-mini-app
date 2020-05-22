const weatherMap = {
  'sunny': 'sunny',
  'cloudy': 'cloudy',
  'overcast': 'overcast',
  'lightrain': 'light rain',
  'heavyrain': 'heavy rain',
  'snow': 'snow'
 }

 const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
 }

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBg: '',
    hourlyWeather: [],
    todayTemp: '',
    todayDate: ''
  },
  onLoad() {
    this.getNow();
  },
  onPullDownRefresh() {
    this.getNow(wx.stopPullDownRefresh);
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: "beijing"
      },
      success: res => {
        let result = res.data.result;
        this.setNow(result);
        this.setHourlyForecast(result);
        this.setToday(result);
      },
      complete: () => {
        callback && callback();
      }
    });
  },
  setNow(result) {
    let temp = result.now.temp;
    let weather = result.now.weather;
    this.setData({
      nowTemp: `${temp}°`,
      nowWeather: weatherMap[weather],
      nowWeatherBg: `/images/${weather}-bg.png`
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    });
  },
  setHourlyForecast(result) {
    let forecast = result.forecast;
    let hourlyWeather = [];
    let nowHour = new Date().getHours();
    for (let i = 0; i < 8; i++) {
      hourlyWeather.push({
        time: (nowHour + i*3) % 24 + ":00",
        iconPath: `/images/${forecast[i].weather}-icon.png`,
        temp: `${forecast[i].temp}°`
      });
    }
    hourlyWeather[0].time = "now";
    this.setData({
      hourlyWeather: hourlyWeather
    });
  },
  setToday(result) {
    let date = new Date();
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} Today`
    });
  },
  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})
