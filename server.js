const express = require("express")
const path = require("path")

const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

app.use(express.static(path.join(__dirname, 'public'))) // definir a pasta de arquivos do front end
app.set("views", path.join(__dirname, "public")) // definir views como html
app.engine("html", require("ejs").renderFile) // definir a engine
app.set("view engine", "html") // definir view engine

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

// armazena as mensagens enviadas
let messages = []
let connectedUsers = []


io.on("connection", socket => {
    console.log(`Socket conectado: ${socket.id}`)
    connectedUsers.push(socket.id)

    socket.emit("previousMessages", messages)

    // lida com as novas conexoes
    socket.emit("connectedUsers", connectedUsers) // envia os usuarios pro client que se conectou agora
    socket.broadcast.emit("connectedUsers", connectedUsers) // envia os usuarios pros ja conectados

    socket.on("sendMessage", data => {
        messages.push(data)

        socket.broadcast.emit("receivedMessage", data)
    })

    // remove o usuário da lista de usuários conectados
    socket.on("disconnect", () => {
        connectedUsers = connectedUsers.filter(item => item != socket.id)
        console.log("user disconnected")
        console.log(socket.id)
        socket.broadcast.emit("connectedUsers", connectedUsers) // envia os usuarios pros ja conectados

    })
})

server.listen(3000, () => {
    console.log("Listening on *: 3000")
})