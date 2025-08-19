import http from "http"
import app from "./index.js"


const port = process.env.PORT || 27019;

const server = http.createServer(app);

server.listen(port,()=>{
    console.log(`server is listening at ${port}`);
});
