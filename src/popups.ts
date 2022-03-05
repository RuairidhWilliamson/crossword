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

document.querySelectorAll("[popup-toggle]").forEach(el => el.addEventListener("click", handlePopupToggle));
document.querySelectorAll(".popup-container").forEach(el => el.addEventListener("click", handlePopupClose));