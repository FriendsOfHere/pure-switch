function isDarkMode() {
  console.log(`cache:isDarkMode: ${cache.get('isDarkMode')}`)
  return _.toSafeInteger(cache.get('isDarkMode')) == 1
}

module.exports = () => ({
          title: "黑暗模式",
          onClick: () => {
            here.exec(`
osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to not dark mode'
`)
            .then((output) => {
                console.log(`appscript toggle output: ${output}`)
                //generate notification
                here.systemNotification(`切换模式成功🤗`, `快看看效果吧`)
                //lazy store flag
                here.exec('defaults read -g AppleInterfaceStyle /dev/null 2>&1')
                    .then((output) => {
                      console.log(`isDark output: ${output}`)
                      //due to a nightly version length bug
                      if (output.indexOf("Dark") != -1) {
                        cache.set('isDarkMode', 1)
                      } else {
                        cache.set('isDarkMode', 0)
                      }
                    })
            })
          },
          accessory: {
            // title: '',
            imageURL: isDarkMode() ? './on.png' : './off.png',
            imageCornerRadius: 4
          },
})

