function isCaffeinateOn() {
  let switchConfigs = cache.get('switchConfigs')
  if (typeof switchConfigs == "undefined") {
      switchConfigs = {caffeinate: 0}
      cache.set('switchConfigs', switchConfigs)
  } else {
      switchConfigs = JSON.parse(switchConfigs)
  }

  return _.toSafeInteger(switchConfigs.caffeinate) == 1
}

module.exports = () => ({
          title: "保持亮屏",
          onClick: () => {
            var switchConfigs = JSON.parse(cache.get('switchConfigs'))
            //kill caffeinate
            if (isCaffeinateOn()) {
              console.log("To kill......")
              // cause here crash ...  don't know why
              // FIX ME
              here.exec(`
pkill caffein
`)
              .then((output) => {
                 console.log(`Kill caffeinate. output: ${output}`)
                 //set to cache
                 switchConfigs.caffeinate = 0
                 cache.set('switchConfigs', switchConfigs)
                 here.systemNotification(`保持亮屏已关闭🤗`, `☕️`)
              })
              .catch((err) => {console.log(err)})


            } else {
              here.exec(`ps -ef | grep Here | grep -v grep | awk '{print $2}'`)
                .then((output) => {
                    const pid = _.trimEnd(output, "\n")
                    console.log(`get Here pid: ${pid}`)
                    //set cache
                    switchConfigs.caffeinate = 1
                    cache.set('switchConfigs', switchConfigs)

                    here.systemNotification(`保持亮屏已开启🤗`, `☕️`)
                    here.exec(`/usr/bin/caffeinate -d -w ${pid} &`)
                        .then((output) => {
                          console.log(`Start caffeinate output: ${output}`)
                        })
                })
            }
          },
          accessory: {
            // title: '',
            imageURL: isCaffeinateOn() ? './on.png' : './off.png',
            imageCornerRadius: 4
          },
})

