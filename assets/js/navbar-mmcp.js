fetch("/assets/navbar/navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar-container").innerHTML = data;

        const navbar = document.getElementById('navbar');
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');

        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.setAttribute('name', 'theme-color');
            document.head.appendChild(themeColorMeta);
        }

        themeColorMeta.setAttribute('content', '#ffadc6');

        const scrollSteps = [
            { limit: 0, className: 'scrolled' }
        ];

        window.addEventListener('scroll', () => {
            scrollSteps.forEach(step => {
                if (window.scrollY > step.limit) {
                    navbar.classList.add(step.className);
                    themeColorMeta.setAttribute('content', '#FC8FB0');
                } else {
                    navbar.classList.remove(step.className);
                    themeColorMeta.setAttribute('content', '#ffadc6');
                }
            });
        });

        if (navbar) {
            navbar.addEventListener('mouseenter', () => {
                if (navbar.classList.contains('scrolled')) {
                    themeColorMeta.setAttribute('content', '#ffadc6');
                }
            });

            navbar.addEventListener('mouseleave', () => {
                if (navbar.classList.contains('scrolled')) {
                    themeColorMeta.setAttribute('content', '#FC8FB0');
                }
            });
        }

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    })
    .catch(err => console.error("Erreur de chargement de la navbar :", err));
