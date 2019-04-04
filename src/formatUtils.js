module.exports = {
  formatAbbrev: function (category) {
    return category.split("_").map((str) => {
      return str.charAt(0).toUpperCase()
    }).join("")
  },

  formatCategoryName: function (category) {
    return category.split("_").map((str) => {
      return str[0].toUpperCase() + str.substring(1, str.length)
    }).join(" ")
  },

  formatDate: function (datetimeStr) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const datetime = datetimeStr.split("T")
    const date = datetime[0];
    const time = datetime[1];

    const splitDate = date.split("-")
    const year = splitDate[0]
    const month = splitDate[1]
    const dateNum = splitDate[2]

    const splitTime = time.split(":")
    const hour = splitTime[0]
    const minute = splitTime[1]
    const second = splitTime[2].substring(0, 2);

    const jsDate = new Date(year, month, dateNum, hour, minute, second)
    return `${dateNum} ${months[parseInt(month) - 1]} ${year}, ${hour}:${minute}:${second}`
  },
}