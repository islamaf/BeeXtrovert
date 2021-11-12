window.onload = function(e) {
    if(document.getElementById("country-code").value == "null"){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(savePosition);
            navigator.permissions.query({name:'geolocation'}).then(function(result) {
                // Will return ['granted', 'prompt', 'denied']
                console.log(result.state);
            });
        } else { 
            x.innerHTML = "Geolocation is not supported by this browser.";
        }

        function savePosition(position){
            console.log("Submit");
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);

            e.preventDefault();
            $.ajax({
                url: "/get_location",
                type: 'POST',
                data: { 
                    done: "done",
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                },
                dataType: 'json',
                success: function (data) {
                    if (data.error) {
                        console.log(data.error);
                    }
                    else{
                        console.log(data.success);
                        $("#country-code").val(data.country_code);
                        $("#country").val(data.country);
                        $("#city").val(data.city);
                    }
                }
            })
        }
    }
};

// Ajax function
// $(window).on('load', function(e) {
//     if($("#geolocation").val() == "null"){
//         e.preventDefault();
//         $.ajax({
//             url: "/get_location",
//             type: 'POST',
//             data: { done: "done"},
//             dataType: 'json',
//             success: function (data) {
//                 if (data.error) {
//                     console.log(data.error);
//                 }
//                 else{
//                     console.log(data.success);
//                     $("#geolocation").val(data.newLocation);
//                 }
//             }
//         })
//     }
// });