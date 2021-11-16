var select = document.getElementById("selectLanguage"); 
var language_list = ["Mandarin Chinese","Spanish","English","Hindi/Urdu","Arabic","Bengali","Portuguese","Russian","Japanese","German","Punjabi","French","Telugu","Vietnamese","Korean","Tamil","Italian","Turkish",];

language_list.sort()

for(var i = 0; i < language_list.length; i++)
{
    var option = document.createElement("option"),
        txt = document.createTextNode(language_list[i]);
    option.appendChild(txt);
    option.setAttribute("value",language_list[i]);
    select.insertBefore(option,select.lastChild);
}

// Get started form
$(function() {
    $("#interests").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            url: "/set_language",
            type: 'POST',
            data: {
                selectLanguage: $('#selectLanguage').find(":selected").text()
            },
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#error').text(data.error);
                }else{
                    window.location.href = data.redirect;
                }
            }
        })
    });
});

// Edit language form
$(function() {
    $("#edit-language").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            url: "/edit_language",
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    console.log(data.error);
                }else{
                    setTimeout(function(){ 
                        $('#languageErrors').text("Updating database...");
                        window.location.href = data.redirect; 
                    }, 1000);
                }
            }
        })
    });
});
