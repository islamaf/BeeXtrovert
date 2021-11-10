// Username validation
$("#username").on("input", function() {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    
    if(format.test($("#username").val()) == true){
        $('#usernameErrors').text("Username can't contain symbols");
    }
    else{
        $('#usernameErrors').text("");
    }
});

// Password validation
$("#password").on("input", function(){
    const format = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/;

    if(format.test($("#password").val()) == true){
        $('#passwordErrors').text("");
    }else{
        $('#passwordErrors').text("Please use: 8 characters, lowercase, uppercase, symbol and a number");
    }
});