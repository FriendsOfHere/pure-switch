/*
 * This file is part of foh.one-switch.
 *
 * Copyright (c) 2020 Lifesign.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

const _ = require("lodash")
const net = require("net")
const cache = require("cache")

function isDarkMode() {
  console.log(`cache:isDarkMode: ${cache.get('isDarkMode')}`)
  return _.toSafeInteger(cache.get('isDarkMode')) == 1
}

function renderOneSwitch() {
  let renderComponent = () => {

    let popOvers = [
            {title: "💖 欢迎使用 One Switch 🥰",
            onClick: () => {here.openURL("https://github.com/FriendsOfHere")}}
        ]
        popOvers = popOvers.concat([
          {
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
          }
        ])

        // Mini Window
        here.setMiniWindow({
            title: "One Switch",
            detail: "Toggle Your Switch",
            popOvers: popOvers
        })

  }

  console.log("Render component start...")
  renderComponent()

  //rerender component display, partial render is not supported for now
  here.onPopOverDisappear(() => {
      console.log("onPopOverDisappear")
      console.log("____Rerender component start")
      renderComponent()
  })

}

here.onLoad(() => {

  renderOneSwitch()

})

net.onChange((type) => {
  console.log("Connection type changed:", type)
  if (net.isReachable()) {
    renderOneSwitch()
  }
})
