// fake file for non-locked in users running kitchen-sink

module.exports.Data = {
  paths: [],
  listingData: {
    sections: [],
  },
}

module.exports.Components = new Proxy(
  {},
  {
    get(target, key) {
      return {}
    },
  }
)

module.exports.listingData = []
module.exports.CurrentRouteProvider = (props) => props.children
