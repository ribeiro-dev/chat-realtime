$(document).ready(function(){
    const URL = window.location.href
    var socket = io(URL)
    let connectedUsers

    $("#username").focus()

    function renderMessage(msg) {
        // função que vai renderizar a mensagem no chat
        const selectedUser = connectedUsers.find(user => user.username == msg.author)
        const color = selectedUser.userColor
        // const datetime = msg.date.toLocaleString("pt-BR")
        const hour = new Date().toLocaleString("pt-BR", { hour: '2-digit', minute: '2-digit' })

        $(".chat").append(`
        <div class="message">
            <div class="info">
                <span class="name" style="color: ${color}">${msg.author}:</span>
                <span class="hour">${hour}</span>
            </div>
            <div>
                <p class="content">${msg.message}</p>
            </div>
        </div>
        `)
    }

    function renderUser(user) {
        $(".users").append(
            `<div class="user-online">
                <p class="username" style="color:${user.userColor}">${user.username}</p>
            </div>`
        )
    }

    // faz o ouvinte pra receber as mensagens existentes ao logar no chat
    socket.on("previousMessages", oldMessages => {
        for (const message of oldMessages) {
            renderMessage(message)
        }
    })

    // faz o ouvinte pra receber os usuarios conectados
    socket.on("connectedUsers", users => {
        $(".users").html("<h2>Usuários no chat:</h2>")
        for (const user of users) {
            renderUser(user)
        }
        console.log(users)
        connectedUsers = users
    })

    // faz o ouvinte para receber uma nova mensagem
    socket.on("receivedMessage", message => {
        renderMessage(message)
        // desce o scroll quando receber a mensagem
        document.querySelector(".chat").scrollBy(0, window.innerHeight)
    })


    // envio do formulário de mensagens
    $("#form").submit(event => {
        event.preventDefault()

        var id = socket.id
        var author = username
        var message = $("#input").val()
        // var date = new Date()

        if (author.length && message.length) {
            var messageObject = {
                id: id,
                author: author,
                message: message,
                //date: date
            }
        }

        renderMessage(messageObject)

        socket.emit("sendMessage", messageObject)
        $("#form").trigger("reset")

        // desce o scroll quando enviar a mensagem
        document.querySelector(".chat").scrollBy(0, window.innerHeight)
    })

    // envio do formulario de username
    $(".username-form").submit(event => {
        event.preventDefault()

        username = $("#username").val()

        //send username to server
        socket.emit("getUsername", {
            id: socket.id,
            username: username
        })

        //close modal
        $(".modal").fadeOut("slow")
    })
  });