function changeEmail(event) {
    var check_div = document.querySelector('.email-content')
    if (check_div !== null) return;

    var div = document.createElement('div')
    div.setAttribute('class', 'email-content')

    var newEmailInput = document.createElement('input')
    newEmailInput.setAttribute('id', 'new-email')
    newEmailInput.setAttribute('placeholder', 'New Email')

    var button = document.createElement('button')
    button.innerText = 'Confirm'
    button.setAttribute('type', 'button')

    var exit = document.createElement('button')
    exit.innerText = "\u2715"

    div.appendChild(newEmailInput)
    div.appendChild(button)
    div.appendChild(exit)

    event.parentNode.parentNode.appendChild(div)

    button.addEventListener('click', function (e) {
        var newEmail = document.getElementById('new-email').value

        e.preventDefault()
        $.ajax({
            url: "/edit_email",
            type: 'POST',
            data: {
                newEmail
            },
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#emailError').text(data.error);
                } else {
                    $('#emailError').text(data.success);
                }
            }
        })

        event.parentNode.parentNode.removeChild(div)
    })

    exit.addEventListener('click', () => {
        event.parentNode.parentNode.removeChild(div)
    })
}

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