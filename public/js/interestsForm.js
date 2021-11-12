$(function() {
    $("#interests").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
          url: "/add_interests",
          type: 'POST',
          data: $(this).serialize(),
          dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#interestsError').text(data.error);
                }else{
                    $('#interestsError').text(data.success);
                    window.location.href = data.redirect;
                }
            }
        })
    });
});