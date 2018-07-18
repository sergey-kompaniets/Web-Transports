$(document).ready(function(){
    let socket = io();
    
    let sender = $('#sender').val();
    
    socket.on('connect', function(){
        let params = {
            sender: sender
        }
        
        socket.emit('joinRequest', params, function(){
            console.log('Joined');
        });
    });
    
    socket.on('newFriendRequest', function(friend){
        // console.log(friend);
        $('#reload').load(location.href + ' #reload');


    });

    $(document).on('submit', '#add_friend',  function(e) {
        e.preventDefault();
        
        let receiverName = $('#receiverName').val();

        $.ajax({
            url: '/groupchat',
            type: 'POST',
            data: {
                receiverName: receiverName
            },
            success: function(){
                socket.emit('friendRequest', {
                    receiver: receiverName,
                    sender: sender
                }, function() {
                    console.log('Request Sent');
                })
            }
        })
    });

    $(document).on('click', '#accept_friend', function(){
        let senderId = $('#senderId').val();
        let senderName = $('#senderName').val();

        $.ajax({
            url: '/groupchat',
            type: 'POST',
            data: {
                senderId: senderId,
                senderName: senderName
            },
            success: function(){
                $(this).parent().eq(1).remove();
            }
        });
        $('#reload').load(location.href + ' #reload');
    });

    $('#cancel_friend').on('click', function() {
        let user_Id = $('#user_Id').val();

        $.ajax({
            url: '/groupchat',
            type: 'POST',
            data: {
                user_Id: user_Id
            },
            success: function(){
                $(this).parent().eq(1).remove();
            }
        });
        $('#reload').load(location.href + ' #reload');
    });
});