const app = require("./server.js");
require('dotenv').config()

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => console.log(`Server running on PORT : ${PORT}`));
