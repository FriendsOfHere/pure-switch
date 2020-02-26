function isSwitchOn() {
    let switchConfigs = cache.get('switchConfigs')
    if (typeof switchConfigs == "undefined") {
        switchConfigs = {hiddenDesktop: 0}
        cache.set('switchConfigs', switchConfigs)
    } else {
        switchConfigs = JSON.parse(switchConfigs)
    }

    return _.toSafeInteger(switchConfigs.hiddenDesktop) == 1
}

//export as a function not object
//due to the rerender called in index.js
module.exports = () => ({
          title: "隐藏桌面",
          onClick: () => {
              here.exec(`
        defaults read com.apple.finder CreateDesktop
        `)
                .then((output) => {
                    console.log(`the desktop now is: ${output}`)

                    var switchConfigs = JSON.parse(cache.get('switchConfigs'))

                    //hiddened
                    if (output.indexOf("false") != -1) {
                        here.exec("defaults write com.apple.finder CreateDesktop true;killall Finder")
                        .then((output) => {
                          console.log(`set hiddenDesktop to true: ${output}`)
                          switchConfigs.hiddenDesktop = 0
                          cache.set('switchConfigs', switchConfigs)
                        })
                    } else if (output.indexOf("true") != -1) {
                        here.exec("defaults write com.apple.finder CreateDesktop false;killall Finder")
                        .then((output) => {
                          console.log(`set hiddenDesktop to false: ${output}`)
                          switchConfigs.hiddenDesktop = 1
                          cache.set('switchConfigs', switchConfigs)
                        })
                    } else {
                        console.error(`set hiddenDesktop error: ${output}`)
                    }
                })
            },
            accessory: {
              imageURL: isSwitchOn() ? './on.png' : './off.png',
              imageCornerRadius: 4
            },
        })
