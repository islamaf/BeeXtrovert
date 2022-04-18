$(document).ready(function (e) {
    setTimeout(() => {
        $(".message-meta").each(function(i) {
            $(this).text(moment($(this).text()).format('h:mm a'))
            $(this).removeAttr('style')
        });
    }, 250);
})