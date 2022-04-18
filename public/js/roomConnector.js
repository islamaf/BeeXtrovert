$(function() {
    $("#connect").on("click", function(e) {
        e.preventDefault();
        $.ajax({
            url: "/newRoomConnection",
            type: 'POST',
            data: { newRoom: true },
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#conn-err').text(data.error)
                    setTimeout(function(){
                        window.location.href = data.redirect;
                    }, 4000);
                }else{
                    $('#conn-err').text(data.success);
                    setTimeout(function(){
                        window.location.href = data.redirect;
                    }, 2000);
                }
            }
        })
    });
});