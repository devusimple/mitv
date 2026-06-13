let CHANNELS = [];

document.getElementById("year").textContent =
    new Date().getFullYear();

const loading =
    document.getElementById("loading");

const player = videojs("player", {
    fluid: true,
    responsive: true,
    liveui: true,
    autoplay: true,
    preload: "auto",
    controls: true,
});

function showLoading() {
    loading.style.display = "flex";
}

function hideLoading() {
    loading.style.display = "none";
}

player.on("waiting", showLoading);
player.on("loadstart", showLoading);
player.on("playing", hideLoading);
player.on("canplay", hideLoading);

function loadChannel(url) {
    showLoading();

    player.src({
        src: url,
        type: "application/x-mpegURL",
    });

    player.play().catch(() => {});
}

fetch("./channels.json")
    .then((res) => res.json())
    .then((data) => {
        CHANNELS = data;
        renderChannels();
        loadChannel(CHANNELS[0].url);
    })
    .catch(() => {
        CHANNELS = [
            { name: "FIFA-1", logo: "./assets/logos/fifa.png", url: "http://172.16.29.3:8090/hls/tsportshd3rd.m3u8" },
            { name: "T SPORTS", logo: "./assets/logos/t-sports.png", url: "http://172.16.29.3:8090/hls/tsportshd.m3u8" },
            { name: "PTV SPORTS", logo: "./assets/logos/ptv.png", url: "http://172.16.29.3:8090/hls/ptvsportshd.m3u8" },
            { name: "A SPORTS", logo: "./assets/logos/a-sports.png", url: "http://172.16.29.3:8090/hls/ASportsHD.m3u8" },
            { name: "STAR SPORTS SELECT 2", logo: "./assets/logos/sss-2.png", url: "http://172.16.29.3:8090/hls/StarSportsSelect2HD.m3u8" },
            { name: "STAR SPORTS 2 HD", logo: "./assets/logos/ss-2.png", url: "http://172.16.29.3:8090/hls/StarSports2HD.m3u8" },
            { name: "STAR SPORTS 1 HD", logo: "./assets/logos/ss-1.png", url: "http://172.16.29.3:8090/hls/SonyTen5HD.m3u8" },
            { name: "SONY TEN 3 HINDI", logo: "./assets/logos/sos-2.png", url: "http://172.16.29.3:8090/hls/SonyTen2hd.m3u8" },
            { name: "SONY SPORTS 5", logo: "./assets/logos/sos-2.png", url: "http://172.16.29.3:8090/hls/SonyTen3hd.m3u8" },
        ];
        renderChannels();
        loadChannel(CHANNELS[0].url);
    });

function renderChannels() {
    const channelsContainer =
        document.getElementById("channels");

    CHANNELS.forEach((channel, index) => {

        const el =
            document.createElement("div");

        el.className =
            "channel" +
            (index === 0 ? " active" : "");

        el.innerHTML = `
            <img
                src="${channel.logo}"
                alt="${channel.name}"
            />
            <span>${channel.name}</span>
        `;

        el.addEventListener("click", () => {

            document
                .querySelectorAll(".channel")
                .forEach(x =>
                    x.classList.remove("active")
                );

            el.classList.add("active");

            loadChannel(channel.url);
        });

        channelsContainer.appendChild(el);
    });
}

let deferredPrompt = null;
const pwaBanner = document.getElementById("pwaBanner");
const pwaInstall = document.getElementById("pwaInstall");
const pwaClose = document.getElementById("pwaClose");

const PWA_DISMISSED_KEY = "mtv_pwa_dismissed";

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    if (localStorage.getItem(PWA_DISMISSED_KEY)) return;
    deferredPrompt = e;
    pwaBanner.classList.add("show");
});

pwaInstall.addEventListener("click", () => {
    pwaBanner.classList.remove("show");
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
    }
});

pwaClose.addEventListener("click", () => {
    pwaBanner.classList.remove("show");
    deferredPrompt = null;
    localStorage.setItem(PWA_DISMISSED_KEY, "1");
});

window.addEventListener("appinstalled", () => {
    pwaBanner.classList.remove("show");
    deferredPrompt = null;
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js");
    });
}
