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
    let newUser = {
        id: socket.id,
        username: socket.id
    }
    connectedUsers.push(newUser)
    

    socket.on("sendMessage", data => {
        messages.push(data)

        socket.broadcast.emit("receivedMessage", data)
    })

    socket.on("getUsername", userData => {
        let socketIndex

        connectedUsers.forEach((obj, index) => {if (obj.id == userData.id) socketIndex = index})
        connectedUsers[socketIndex].username = userData.username

        // lida com as novas conexoes
        socket.emit("connectedUsers", connectedUsers) // envia os usuarios pro client que se conectou agora
        socket.broadcast.emit("connectedUsers", connectedUsers) // envia os usuarios pros ja conectados

        // envia as mensagens existentes do servidor
        socket.emit("previousMessages", messages)
    })

    // remove o usuário da lista de usuários conectados
    socket.on("disconnect", () => {
        connectedUsers = connectedUsers.filter(item => item.id != socket.id)
        console.log("user disconnected")
        console.log(socket.id)
        socket.broadcast.emit("connectedUsers", connectedUsers) // envia os usuarios pros ja conectados

    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Listening on *: ${PORT}`)
})