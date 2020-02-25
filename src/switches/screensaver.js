module.exports = {
  title: "屏幕保护",
  onClick: () => {
      here.exec(`open -a ScreenSaverEngine`)
      .then(() => {
          console.log("Start ScreenSaver.")
      })
  }
}
