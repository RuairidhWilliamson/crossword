function handlePopupToggle(e) {
    const popupId = e.target.getAttribute("popup-toggle");
    const elem = document.querySelector(`.popup-container#${popupId}`);
    elem.classList.toggle("show");
}

function handlePopupClose(e) {
    if (e.target.classList.contains("popup-container")) {
        e.target.style.opacity = 0;
        setTimeout(() => {
            e.target.style.opacity = "";
            e.target.classList.remove("show");
        }, 500);
    }
}

document.querySelector("[popup-toggle]").addEventListener("click", handlePopupToggle);
document.querySelector(".popup-container").addEventListener("click", handlePopupClose);