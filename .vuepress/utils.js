function deepClone(d) {
  return JSON.parse(JSON.stringify(d))
}

function genNav(items) {
  return items.filter(v => {
    if (v.items && v.items.length > 0) {
      v.items = genNav(v.items)
    }
    return v
  })
}

function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%*$#=~_-]+))*$/
  return urlregex.test(textval)
}

function isExternalLink(routePath) {
  return validateURL(routePath)
}

function getComponentSidebar(item) {
  return item[0].items.map(v => {
    return v.link
  })
}

module.exports = {
  genNav,
  getComponentSidebar,
  deepClone
}
