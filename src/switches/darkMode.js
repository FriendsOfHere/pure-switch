function isDarkMode() {
  let switchConfigs = cache.get('switchConfigs')
  if (typeof switchConfigs == "undefined") {
      switchConfigs = {isDarkMode: 0}
      cache.set('switchConfigs', switchConfigs)
  } else {
      switchConfigs = JSON.parse(switchConfigs)
  }

  return _.toSafeInteger(switchConfigs.isDarkMode) == 1
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
                      let switchConfigs = JSON.parse(cache.get('switchConfigs'))
                      //due to a nightly version length bug
                      if (output.indexOf("Dark") != -1) {
                        switchConfigs.isDarkMode = 1
                        cache.set('switchConfigs', switchConfigs)
                      } else {
                        switchConfigs.isDarkMode = 0
                        cache.set('switchConfigs', switchConfigs)
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

