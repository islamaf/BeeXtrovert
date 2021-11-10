function validateGender(){
    const error = document.getElementById("error");
    
    if((!document.getElementById('male').checked) && (!document.getElementById('female').checked)){
        error.innerHTML = "Please Select your gender.";
    }
}