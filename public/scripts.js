$(document).ready(function(){
    var socket = io("localhost:3000")

    function renderMessage(msg) {
        // função que vai renderizar a mensagem no chat
        $(".chat").append(`
        <div class="message">
            <p>
                <strong class="name">${msg.author}</strong>:
                ${msg.message}
            </p>
        </div>
        `)
    }

    function renderUser(user) {
        $(".users").append(
            `<div class="user-online">
                <p class="username">${user}</p>
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
    })

    // faz o ouvinte para receber uma nova mensagem
    socket.on("receivedMessage", message => {
        renderMessage(message)
    })

    $("#form").submit(event => {
        event.preventDefault()

        // var author = $("input[name=username]").val()
        var author = socket.id
        var message = $("#input").val()

        if (author.length && message.length) {
            var messageObject = {
                author: author,
                message: message
            }
        }

        renderMessage(messageObject)

        socket.emit("sendMessage", messageObject)
        $("#form").trigger("reset")
    })
  });