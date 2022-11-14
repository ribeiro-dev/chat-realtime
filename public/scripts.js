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

    // faz o ouvinte pra receber as mensagens existentes ao logar no chat
    socket.on("previousMessages", oldMessages => {
        for (const message of oldMessages) {
            renderMessage(message)
        }
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