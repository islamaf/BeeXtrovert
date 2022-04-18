$(function() {
    $("#signup").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
          url: "/sign_up",
          type: 'POST',
          data: $(this).serialize(),
          dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#signup-error').text(data.error);
                }else{
                    window.location.href = data.redirect;
                }
            }
        })
    });
});