$(document).ready(function(){
    var socket = io("localhost:3000")
    let username

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
                <p class="username">${user.username}</p>
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


    // envio do formulário de mensagens
    $("#form").submit(event => {
        event.preventDefault()

        var id = socket.id
        var author = username
        var message = $("#input").val()

        if (author.length && message.length) {
            var messageObject = {
                id: id,
                author: author,
                message: message
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
        console.log(username)

        //send username to server
        socket.emit("getUsername", {
            id: socket.id,
            username: username
        })

        //close modal
        $(".modal").fadeOut("slow")
    })
  });