function clickVideo(){var e=document.querySelector("[data-video]");e&&e.click()}function checkLiveParam(){null!==new Proxy(new URLSearchParams(window.location.search),{get:(e,c)=>e.get(c)}).live&&clickVideo()}"loading"!=document.readyState?checkLiveParam():document.addEventListener("DOMContentLoaded",checkLiveParam());