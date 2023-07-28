// Complete Events Exercise
const { EventEmitter } = require("events");
const http = require("http");
const fs = require("fs");
const newsletterEmitter = new EventEmitter();
const PORT = 5555;

//set it to a variable
const server = http.createServer((req, res) => {
    const { method, url } = req;
    req.on("data", (packet) => {
        chunks.push(packet);
    });

    const chunks = [];

    req.on("end", () => {
        //when the END event happens, we need to route
        if (url == "/newsletter_signup" && method == "POST"){
            const postData = Buffer.concat(chunks).toString();
            console.log("postData:", postData);
            newsletterEmitter.emit("newsletter_signup", postData);
            //send back a response to the client
            res.writeHead(200, { "content-type": "text/html" });
            res.write("User signed up!");
            res.end();
        } else {
            res.writeHead(404, { "content-type": "text/html" });
            res.write("No resource at endpoint");
            res.end();
        }
    
    });

    newsletterEmitter.on("newsletter_signup", (contact) => {
        fs.writeFile("newsletterUsers.csv", contact, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Added ${contact} to csv file`);
            }
    });
});

});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});