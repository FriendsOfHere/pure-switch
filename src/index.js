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
const screenSaverRender = require("./switches/screensaver.js")
const hiddenDesktopRender = require("./switches/hiddenDesktop.js")
const darkModeRender = require("./switches/darkMode.js")
const caffeinateRender = require("./switches/caffeinate.js")

here.onLoad(() => {
  console.log(`DEBUG:-----${cache.get("switchConfigs")}`)
  renderOneSwitch()
})

function renderOneSwitch() {
  let renderComponent = () => {

    let popOvers = [
            {title: "💖 欢迎使用 One Switch 🥰",
            onClick: () => {here.openURL("https://github.com/FriendsOfHere")}}
        ]

        //TODO pref for custom sorting
        popOvers = popOvers.concat([
          darkModeRender(), 
          hiddenDesktopRender(),
          caffeinateRender(),
          screenSaverRender(),
        ])

        // Mini Window
        here.setMiniWindow({
            title: "One Switch",
            detail: "Toggle Your Switches",
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

