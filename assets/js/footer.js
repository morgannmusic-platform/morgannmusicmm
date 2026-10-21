document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
        fetch("/assets/footer/footer.html")
            .then(response => response.text())
            .then(data => { footerContainer.innerHTML = data; })
            .catch(err => console.error("Erreur de chargement du footer :", err));
    }
});