$(function() {
    $("#signin").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
          url: "/sign_in",
          type: 'POST',
          data: $(this).serialize(),
          dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#signin-error').text(data.error);
                }else{
                    window.location.href = data.redirect;
                }
            }
        })
    });
});