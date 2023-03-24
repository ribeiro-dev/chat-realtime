const express = require("express")
const path = require("path")
const connection = require('./data/database')
const Message = require('./data/Message')

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

// Database
connection.
    authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados')
        
        
    })
    .catch(msg => {
        console.log(msg)
    })

// SELECT
Message.findAll({
    raw: true
}).then(res => {
    // console.log(Object.keys(res))
    // console.log(res)
    for (const msg of res) {
        data = new Date(msg["createdAt"])
        msg["localDate"] = new Date(msg["createdAt"])

        console.log(msg)
        messages.push(msg)
    }
})

// armazena as mensagens enviadas
let messages = []
let connectedUsers = []


io.on("connection", socket => {
    console.log(`Socket conectado: ${socket.id}`)
    const userColor = Math.floor(Math.random()*16777215).toString(16);

    let newUser = {
        id: socket.id,
        userName: socket.id,
        userColor: '#' + userColor
    }
    connectedUsers.push(newUser)
    

    socket.on("sendMessage", async data => {
        messages.push(data)
        const userColor = connectedUsers.find(user => user.userName == data.userName).userColor
        console.log(data)
        // await Message.create({
        //     userName: data.userName,
        //     userColor: userColor,
        //     content: data.content
        // })

        socket.broadcast.emit("receivedMessage", data)
    })

    socket.on("getUsername", userData => {
        let socketIndex

        connectedUsers.forEach((obj, index) => {if (obj.id == userData.id) socketIndex = index})
        connectedUsers[socketIndex].userName = userData.userName

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