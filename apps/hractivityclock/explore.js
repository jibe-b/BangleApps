


bangle.http

require("Storage").write("heartRateHistory.json", heartRateHistory)
file = require("Storage").open("data.json", "r")
line = file.readLine()