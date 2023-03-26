$(document).ready(function(){
    const URL = window.location.href
    var socket = io(URL)
    let connectedUsers

    $("#username").focus()

    function renderMessage(msg, getUserColor = true) {
        // função que vai renderizar a mensagem no chat
        if (getUserColor) {
            const selectedUser = connectedUsers.find(user => user.userName == msg.userName)
            const color = selectedUser.userColor
            msg.userColor = color
        }

        // message not from database
        if (!msg.createdAt) {
            const hour = new Date().toLocaleString("pt-BR", { hour: '2-digit', minute: '2-digit' })

            msg.createdAt = new Date().toJSON() //UTC
        }


        const convertedDate = (new Date(msg.createdAt)).toLocaleString("pt-BR", { 
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: '2-digit',
            minute: '2-digit',
        })

        const localDate = {date, hour} = convertedDate.split(',')
        msg.localDate = `${localDate.join(' ')}`
        $(".chat").append(`
        <div class="message">
            <div class="info">
                <span class="name" style="color: ${msg.userColor}">${msg.userName}:</span>
                <span class="hour">${msg.localDate}:</span>
            </div>
            <div>
                <p class="content">${msg.content}</p>
            </div>
        </div>
        `)
    }

    function renderUser(user) {
        $(".users").append(
            `<div class="user-online">
                <p class="username" style="color:${user.userColor}">${user.userName}</p>
            </div>`
        )
    }

    // faz o ouvinte pra receber as mensagens existentes ao logar no chat
    socket.on("previousMessages", oldMessages => {
        console.log(oldMessages)
        for (const message of oldMessages) {
            renderMessage(message, false)
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
        var author = userName
        var message = $("#input").val()
        // var date = new Date()

        if (author.length && message.length) {
            var messageObject = {
                id: id,
                userName: author,
                content: message,
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

        userName = $("#username").val()

        //send username to server
        socket.emit("getUsername", {
            id: socket.id,
            userName: userName
        })

        //close modal
        $(".modal").fadeOut("slow")
    })
  });