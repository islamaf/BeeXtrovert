// Password validation
$(document).on("focus", "#new-password", function(){
    const format = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/;

    if(format.test($("#password").val()) == true){
        $('#passwordErrors').text("");
    }else{
        $('#passwordErrors').text("Please use: 8 characters, lowercase, uppercase, symbol and a number");
    }
});

function changePassword(event) {
    var check_div = document.querySelector('.password-content')
    if (check_div !== null) return;

    var div = document.createElement('div')
    div.setAttribute('class', 'password-content')

    var oldPassInput = document.createElement('input')
    oldPassInput.setAttribute('id', 'old-password')
    oldPassInput.setAttribute('type', 'password')
    oldPassInput.setAttribute('placeholder', 'Old Password')

    var newPassInput = document.createElement('input')
    newPassInput.setAttribute('id', 'new-password')
    newPassInput.setAttribute('type', 'password')
    newPassInput.setAttribute('placeholder', 'New Password')

    var confirmPassInput = document.createElement('input')
    confirmPassInput.setAttribute('id', 'confirm-password')
    confirmPassInput.setAttribute('type', 'password')
    confirmPassInput.setAttribute('placeholder', 'Confirm Password')

    var button = document.createElement('button')
    button.innerText = 'Confirm'
    button.setAttribute('type', 'button')

    var exit = document.createElement('button')
    exit.innerText = "\u2715"

    div.appendChild(oldPassInput)
    div.appendChild(newPassInput)
    div.appendChild(confirmPassInput)
    div.appendChild(button)
    div.appendChild(exit)

    event.parentNode.parentNode.appendChild(div)

    button.addEventListener('click', function (e) {
        var oldPass = document.getElementById('old-password').value
        var newPass = document.getElementById('new-password').value
        var confirmPass = document.getElementById('confirm-password').value

        if (newPass !== confirmPass) {
            return
        }

        e.preventDefault()
        $.ajax({
            url: "/edit_password",
            type: 'POST',
            data: {
                newPassword: newPass,
                oldPassword: oldPass
            },
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#passwordErrors').text(data.error);
                } else {
                    $('#passwordErrors').text(data.success);
                }
            }
        })

        event.parentNode.parentNode.removeChild(div)
    })

    exit.addEventListener('click', () => {
        event.parentNode.parentNode.removeChild(div)
    })
}