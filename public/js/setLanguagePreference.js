// Get started form
$(function () {
    $("#interests").on("submit", function (e) {
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
                } else {
                    window.location.href = data.redirect;
                }
            }
        })
    });
});

function changeLanguage(event) {
    var check_div = document.querySelector('.language-selector')
    if (check_div !== null) return;

    var language_list = ["Mandarin Chinese", "Spanish", "English", "Hindi/Urdu", "Arabic", "Bengali", "Portuguese", "Russian", "Japanese", "German", "Punjabi", "French", "Telugu", "Vietnamese", "Korean", "Tamil", "Italian", "Turkish",];

    var div = document.createElement('div')
    div.setAttribute('id', 'language-selector')
    div.setAttribute('class', 'language-selector')

    var select = document.createElement('select')
    select.setAttribute('id', "selectLanguage")
    select.setAttribute('name', "selectLanguage")

    var option = document.createElement('option')
    option.innerText = "Choose your language"
    option.selected = true
    option.disabled = true

    var button = document.createElement('button')
    button.innerText = 'Confirm'
    button.setAttribute('type', 'button')

    var exit = document.createElement('button')
    exit.innerText = "\u2715"

    select.appendChild(option)

    language_list.sort()

    for (var i = 0; i < language_list.length; i++) {
        var option = document.createElement("option"), txt = document.createTextNode(language_list[i]);
        option.appendChild(txt);
        option.setAttribute("value", language_list[i]);
        select.insertBefore(option, select.lastChild);
    }
    div.appendChild(select)
    div.appendChild(button)
    div.appendChild(exit)

    event.parentNode.parentNode.appendChild(div)

    button.addEventListener('click', function (e) {
        var option = document.getElementById('selectLanguage')
        var languageSpan = document.getElementById('language')

        e.preventDefault()
        $.ajax({
            url: "/edit_language",
            type: 'POST',
            data: {
                language: option.value
            },
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#interestsError').text(data.error);
                } else {
                    $('#interestsError').text(data.success);
                }
            }
        })

        event.parentNode.parentNode.removeChild(div)

        languageSpan.innerHTML = option.value
    })

    exit.addEventListener('click', () => {
        event.parentNode.parentNode.removeChild(div)
    })
}

function confirmLanguage() {
    var languageSelect = document.querySelector('.language-selector')
    var option = document.getElementById('selectLanguage')
    var languageSpan = document.getElementById('language')

    $.ajax({
        url: "/edit_language",
        type: 'POST',
        data: {
            language: option.value
        },
        dataType: 'json',
        success: function (data) {
            if (data.error) {
                $('#interestsError').text(data.error);
            } else {
                $('#interestsError').text(data.success);
            }
        }
    })

    languageSpan.innerHTML = option.value

    languageSelect.style.display = "none"
}
