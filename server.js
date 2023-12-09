const cluster = require("cluster");
const http = require("http");
const { Server } = require("socket.io");
const numCPUs = require("os").cpus().length;
const redis = require("redis");

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const httpServer = http.createServer();

  httpServer.listen(3000);
  console.log(`Master ${process.pid} is running`); 

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  

  const httpServer = http.createServer();
  const io = new Server(httpServer);

  // use the cluster adapter

  io.on("connection", (socket) => {
    console.log(`Socket id is ${socket.id}`);
    console.log('message', 'Server received: ${message}')
  });
}

