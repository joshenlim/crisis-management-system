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

  formatDispatchVehicles: function(dispatchList) {
    const formatData = []
    if (dispatchList.length == 0) return [];
    else {
      dispatchList.forEach((dispatchInfo) => {
        let found = false;
        let foundIndex = 0;
        formatData.forEach((data, index) => {
          if (data.station == dispatchInfo.fire_station) {
            found = true;
            foundIndex = index;
          }
        });
        if (found) {
          formatData[foundIndex].dispatch.push({
            plate_number: dispatchInfo.plate_number,
              call_sign: dispatchInfo.call_sign,
              veh_status: dispatchInfo.veh_status,
              on_off_call: dispatchInfo.on_off_call,
          })
        } else {
          formatData.push({
            station_name: dispatchInfo.fire_station,
            incident_id: dispatchInfo.incident_id,
            dispatch: [{
              plate_number: dispatchInfo.plate_number,
              call_sign: dispatchInfo.call_sign,
              veh_status: dispatchInfo.veh_status,
              on_off_call: dispatchInfo.on_off_call,
            }]
          })
        }
      });
      return formatData;
    }
  }
}