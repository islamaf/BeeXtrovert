$(document).on("click", "#report", function (e) {
    console.log($(this).data("url"))
    e.preventDefault();
    $.ajax({
        url: $(this).data("url"),
        type: 'POST',
        data: {},
        dataType: 'json',
        success: function (data) {
            if (data.error) {
                // console.log(data.error);
                alert(data.error)
            } else if(data.success) {
                // window.location.href = data.redirect;
                // console.log(data.success)
                alert(data.success)
            } else {
                window.location.href = data.refresh;
            }
        }
    })
});
