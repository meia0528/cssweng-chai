let currentLanguage = "en";

// change dropdown
const langToggle = document.getElementById("lang-toggle");
const languages = document.querySelectorAll(".dropdown-item-lang");

languages.forEach(item => {
    item.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedLang = item.getAttribute("data-lang");

    if (selectedLang === "en") 
    {
        langToggle.textContent = "EN";
        document.getElementById("lang-icon").src = "images/EN.png"; 
    } 
    else if (selectedLang === "tagalog") 
    {
        langToggle.textContent = "TAG";
        document.getElementById("lang-icon").src = "images/TAG.png";
    }
    });
})

// translate, fetch from json file
function translate(lang)
{
    fetch(`/language/${lang}.json`).then(response => response.json())
    .then(data => {
        document.querySelectorAll("[data-i18n]").forEach(elem =>{
            const key = elem.getAttribute("data-i18n");
            if(data[key]){
                elem.textContent = data[key];
            }
        });
    });

    currentLanguage = lang;
}

document.addEventListener("DOMContentLoaded", () =>{
    translate(currentLanguage);

    document.querySelectorAll(".dropdown-item[data-lang]").forEach(item =>{
        item.addEventListener("click", () =>{
            const lang = item.getAttribute("data-lang");
            translate(lang);
        });
    });
});