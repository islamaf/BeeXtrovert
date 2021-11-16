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