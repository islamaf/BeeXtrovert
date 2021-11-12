var startTimer = function() {
    if(document.getElementById("country-code").value == "null"){
        document.getElementById("submit-interests").disabled = true;
    }else{
        document.getElementById("submit-interests").disabled = false;
    }

    window.setTimeout(startTimer, 1000);
};

startTimer();