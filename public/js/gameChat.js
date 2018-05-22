  // initializing socket, connection to server
  var room = document.getElementsByClassName("gameid")[0].getAttribute('gameid');
  console.log(room);
  const gameChatSocket = io.connect('http://localhost:3000');
  gameChatSocket.on('connect', function(data) {
    gameChatSocket.emit('room', room);
    //gameChatSocket.emit('join', 'Hello server from game chat: ' + room);
  });

  // listener for 'thread' event, which updates messages
  gameChatSocket.on('thread', function(data) {
    $('#thread').append('<li>' + data + '</li>');
    var element = document.getElementById('thread');
    element.scrollTop = element.scrollHeight;
  });

  // prevents form from submitting and sends a message to server
  $('#gameChat').submit(function(){
    var message = $('#message').val();
    if(message != ""){
      var username = $('#user').text();
      var full_message = username + ': ' + message;
      gameChatSocket.emit('messages', full_message);
      //gameChatSocket.emit('room', room);
      this.reset();}
    return false;
 });