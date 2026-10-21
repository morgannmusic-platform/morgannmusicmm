const WORKER_URL = "https://api.worker.mm-cp.uk";
const MORGANN_USER_UID = "VeVYHd5ql8e4WuAnSUoM9TegEgM2";

document.addEventListener("DOMContentLoaded", () => {
    fetchArtistInfo();
    fetchReleases();
});

function formatImageUrl(url) {
    if (!url) return "";
    const cleanUrl = url.trim();
    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://") || cleanUrl.startsWith("data:")) {
        return cleanUrl;
    }
    const relativePath = cleanUrl.replace(/^\/+/, '');
    if (relativePath.startsWith('api/files/')) {
        return `${WORKER_URL}/${relativePath}`;
    }
    return `${WORKER_URL}/api/files/${encodeURIComponent(relativePath)}`;
}

async function fetchArtistInfo() {
    try {
        const response = await fetch(`${WORKER_URL}/api/artists`);
        if (!response.ok) return;

        const data = await response.json();
        const artists = data.artists || [];
        const mmArtist = artists.find(a => a.id === 1 || a.userUid === MORGANN_USER_UID || a.name === "Morgann Music");

        if (mmArtist && mmArtist.description) {
            document.getElementById("artist-description").innerText = mmArtist.description;
        } else {
            document.getElementById("artist-description").innerText = "Bienvenue dans l'univers musical de Morgann Music.";
        }
    } catch (err) {
        document.getElementById("artist-description").innerText = "Bienvenue dans l'univers musical de Morgann Music.";
    }
}

function renderCoverMedia(release, imgElId, motionElId, skeletonId) {
    const imgEl = document.getElementById(imgElId);
    const motionEl = document.getElementById(motionElId);
    const skeletonEl = document.getElementById(skeletonId);

    const animatedUrlRaw = release.animatedCoverUrl || release.animated_cover_url || release.appleMotion11 || release.appleMotion34;
    const coverUrlRaw = release.coverUrl || release.cover_url;

    const animatedUrl = formatImageUrl(animatedUrlRaw);
    const coverUrl = formatImageUrl(coverUrlRaw);

    if (animatedUrl) {
        motionEl.src = animatedUrl;
        motionEl.classList.remove("hidden");
        motionEl.addEventListener('loadeddata', () => {
            if (skeletonEl) skeletonEl.style.display = "none";
        }, { once: true });
    } else if (coverUrl) {
        imgEl.src = coverUrl;
        imgEl.classList.remove("hidden");
        if (skeletonEl) skeletonEl.style.display = "none";
    }
}

async function fetchReleases() {
    try {
        const response = await fetch(`${WORKER_URL}/api/releases`);
        if (!response.ok) return;

        const data = await response.json();
        const releases = data.releases || [];

        const mmReleases = releases.filter(r =>
            r.userUid === MORGANN_USER_UID ||
            r.userId === MORGANN_USER_UID ||
            (r.artistName && r.artistName.toLowerCase() === "morgann music")
        );

        const now = new Date();

        const past = mmReleases
            .filter(r => r.releaseDate && new Date(r.releaseDate) <= now)
            .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

        const future = mmReleases
            .filter(r => r.releaseDate && new Date(r.releaseDate) > now)
            .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

        // Injecter Dernière Sortie
        if (past.length > 0) {
            const last = past[0];
            document.getElementById("last-title").innerText = last.title || "Sans titre";
            document.getElementById("last-artist").innerText = last.artistName || "Morgann Music";

            renderCoverMedia(last, "last-cover", "last-motion", "last-cover-skeleton");

            if (last.spotifyUrl) {
                const btnSp = document.getElementById("last-spotify");
                btnSp.href = last.spotifyUrl;
                btnSp.classList.remove("hidden");
            }

            if (last.appleUrl) {
                const btnAp = document.getElementById("last-apple");
                btnAp.href = last.appleUrl;
                btnAp.classList.remove("hidden");
            }
        } else {
            document.getElementById("last-release-section").style.display = "none";
        }

        // Injecter Prochaine Sortie
        if (future.length > 0) {
            const next = future[0];
            const dateObj = new Date(next.releaseDate);

            document.getElementById("next-title").innerText = next.title || "Sans titre";
            document.getElementById("next-artist").innerText = next.artistName || "Morgann Music";

            renderCoverMedia(next, "next-cover", "next-motion", "next-cover-skeleton");

            const months = ["JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"];
            document.getElementById("next-day").innerText = dateObj.getDate();
            document.getElementById("next-month").innerText = months[dateObj.getMonth()];
            document.getElementById("next-year").innerText = dateObj.getFullYear();
            document.getElementById("next-date-box").classList.remove("hidden");

            const gcalTitle = encodeURIComponent(`${next.title} - ${next.artistName}`);
            const gcalDate = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
            const btnGcal = document.getElementById("next-gcal");
            btnGcal.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=${gcalDate}/${gcalDate}`;
            btnGcal.classList.remove("hidden");
        } else {
            document.getElementById("next-release-section").style.display = "none";
        }

    } catch (err) {
        console.error("Erreur de récupération des données :", err);
    }
}