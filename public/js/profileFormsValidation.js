// Validate username
$(function() {
    $("#edit-username").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
          url: "/edit_username",
          type: 'POST',
          data: $(this).serialize(),
          dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#userError').text(data.error);
                }else if(data.success){
                    $('#userError').text(data.success);
                    setTimeout(function(){ 
                        $('#userError').text("Updating database...");
                        window.location.href = data.redirect; 
                    }, 1000);
                }
            }
        })
    });
});

// Validate email
$(function() {
    $("#edit-email").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
          url: "/edit_email",
          type: 'POST',
          data: $(this).serialize(),
          dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#emailError').text(data.error);
                }else if(data.success){
                    $('#emailError').text(data.success);
                    setTimeout(function(){ 
                        $('#emailError').text("Updating database...");
                        window.location.href = data.redirect; 
                    }, 1000);
                }
            }
        })
    });
});

// Validate password
$(function() {
    $("#edit-password").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
          url: "/edit_password",
          type: 'POST',
          data: $(this).serialize(),
          dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#passError').text(data.error);
                }else if(data.success){
                    $('#passError').text(data.success);
                    setTimeout(function(){ 
                        $('#passError').text("Updating database...");
                        window.location.href = data.redirect; 
                    }, 1000);
                }
            }
        })
    });
});

// Validate deletion
$(function() {
    $("#delete").on("click", function(e) {
        e.preventDefault();
        $.ajax({
          url: "/delete_user",
          type: 'POST',
          data: $(this).serialize(),
          dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#passError').text(data.error);
                }else if(data.success){
                    // $('#passError').text(data.success);
                    setTimeout(function(){ 
                        // $('#passError').text("Updating database...");
                        window.location.href = data.redirect; 
                    }, 500);
                }
            }
        })
    });
});