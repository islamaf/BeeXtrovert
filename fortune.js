var fortuneCookies = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
    "You have a secret admirer.",
    "Patience is your alley at the moment. Don’t worry!",
    "Nothing is impossible to a willing heart.",
    "Don’t worry about money. The best things in life are free.",
];

exports.getFortune = function(){
    var idx = Math.floor(Math.random() * fortuneCookies.length);
    return fortuneCookies[idx];
}