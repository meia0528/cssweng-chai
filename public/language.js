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

    localStorage.setItem('selectedLang', selectedLang);
    translate(selectedLang);
    
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

        currentLanguage = lang;
    });
}

document.addEventListener("DOMContentLoaded", () =>{

    const savedLang = localStorage.getItem('selectedLang');
    const initialLang = savedLang || currentLanguage;

    translate(initialLang);

    if (initialLang === "tagalog"){
        langToggle.textContent = "TAG";
        document.getElementById("lang-icon").src = "images/TAG.png";
    }
    else {
        langToggle.textContent = "EN";
        document.getElementById("lang-icon").src = "images/EN.png"; 
    }
});