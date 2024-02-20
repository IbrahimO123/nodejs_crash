const http = require("http");
console.log(__dirname)
console.log(__filename )

const server = http.createServer(() => {console.log("Creating server...");});
server.listen(3000, () => {console.log("Listening on port 3000....")})



