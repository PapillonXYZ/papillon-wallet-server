const os = require("os");
const fastify = require("fastify")({
    logger: true,
});
require('dotenv').config()

const createRestaurant = require("./module/restaurant.js");

// Declare a route
fastify.get("/", function (request, reply) {
    reply.send(
        { 
            status: "ok" ,
            package_name: process.env.npm_package_name,
            package_version: process.env.npm_package_version,
            port : process.env.PORT ?? 3000,
            host:{
                os : process.platform,
                cpu_arch : process.arch,
                hostname : os.hostname(),
                node_version : process.version,
            },
            url_scheme: [{
                name: "Add restautant pass",
                url: "/restaurant",
                method: "POST",
                parameters: [
                    {
                        name: "name",
                        type: "string",
                        required: false,
                        description: "Name of the user",
                    },
                    {
                        name: "classe",
                        type: "string",
                        required: false,
                        description: "Class of the user",
                    },
                    {
                        name: "qrcodenumber",
                        type: "string",
                        required: true,
                        description: "QR Code number of the user",
                    },
                    {
                        name:"os",
                        type:"string",
                        required:true,
                        description:"OS of the user",
                    }
                ],
            }
        ],
        });
});

fastify.post("/restaurant", async (request, reply) => {
    const { name } = request.body;
    const { classe } = request.body;
    const { qrcodenumber } = request.body;
    const { os } = request.body;

    const restaurant = await createRestaurant(name, classe, qrcodenumber, os);

    console.log(restaurant);

    reply.header("Content-Type", "application/vnd-apple.pkpass");
    reply.send(restaurant.getAsBuffer());
    
});

// Démaerrage du serveur
fastify.listen({ port: process.env.PORT ?? 3000 }, function (err) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
