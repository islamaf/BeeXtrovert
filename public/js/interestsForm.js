function appendInterest() {
    var li = document.createElement('div')
    var input = document.createElement('input')
    var inputConfirmButton = document.createElement('button')
    var deleteButton = document.createElement('button')
    var exit = document.createElement('button')
    var interestsList = document.getElementById('interests')

    li.setAttribute("class", "interests-item")
    inputConfirmButton.innerText = "Confirm"
    inputConfirmButton.setAttribute("id", "confirmInterest")
    
    deleteButton.innerText = "\u2715"
    exit.innerText = "\u2715"
    
    li.appendChild(input)
    li.appendChild(inputConfirmButton)
    li.appendChild(exit)
    interestsList.appendChild(li)

    inputConfirmButton.addEventListener('click', function (e) {
        li.removeChild(input)
        li.removeChild(inputConfirmButton)
        li.removeChild(exit)
        inputConfirmButton.setAttribute("data-url", "/add_interest")
        inputConfirmButton.setAttribute("data-interest", input.value)
        li.appendChild(document.createTextNode(input.value));
        li.appendChild(deleteButton)
        interestsList.appendChild(li)

        e.preventDefault();
        console.log($(this).data("interest"))
        $.ajax({
            url: $(this).data("url"),
            type: 'POST',
            data: {
                interest: $(this).data("interest")
            },
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    $('#interestsError').text(data.error);
                }else{
                    $('#interestsError').text(data.success);
                }
            }
        })
    })

    exit.addEventListener('click', () => {
        interestsList.removeChild(li)
    })
}

function deleteInterest(event) {
    var url = event.getAttribute('data-url') 
    var interest = event.getAttribute('data-interest')
    $.ajax({
        url,
        type: 'POST',
        data: {
            interest
        },
        dataType: 'json',
        success: function (data) {
            if (data.error) {
                $('#interestsError').text(data.error);
            }else{
                $('#interestsError').text(data.success);
            }
        }
    })
    
    event.parentNode.remove()
}