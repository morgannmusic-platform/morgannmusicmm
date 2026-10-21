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

        themeColorMeta.setAttribute('content', '#FCEB9B');

        const scrollSteps = [
            { limit: 0, className: 'scrolled' }
        ];

        window.addEventListener('scroll', () => {
            scrollSteps.forEach(step => {
                if (window.scrollY > step.limit) {
                    navbar.classList.add(step.className);
                    themeColorMeta.setAttribute('content', '#f9df9f');
                } else {
                    navbar.classList.remove(step.className);
                    themeColorMeta.setAttribute('content', '#FCEB9B');
                }
            });
        });

        if (navbar) {
            navbar.addEventListener('mouseenter', () => {
                if (navbar.classList.contains('scrolled')) {
                    themeColorMeta.setAttribute('content', '#FCEB9B');
                }
            });

            navbar.addEventListener('mouseleave', () => {
                if (navbar.classList.contains('scrolled')) {
                    themeColorMeta.setAttribute('content', '#f9df9f');
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
