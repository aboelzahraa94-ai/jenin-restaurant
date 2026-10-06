// ===============================
// SUPABASE
// ===============================

const SUPABASE_URL = "https://umypydotylxxdgpofqfn.supabase.co";

// ضع الـ Publishable Key الخاص بمشروعك هنا
const SUPABASE_KEY = "sb_publishable_VIoDDn2SB5qQM0YUa0-1hg_zrdthjm2";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ===============================
// DATA
// ===============================

let restaurant = null;
let categories = [];
let products = [];

let selectedCategory = "all";
let searchText = "";


// ===============================
// LOAD RESTAURANT
// ===============================

async function loadRestaurant() {

    const { data, error } = await supabaseClient
        .from("restaurants")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Restaurant error:", error);
        return;
    }

    restaurant = data;

    if (!restaurant) {
        console.error("لم يتم العثور على المطعم");
        return;
    }

    console.log("Restaurant loaded:", restaurant);

    updateRestaurantInfo();

await Promise.all([
    loadGallery(),
    loadCategories(),
    loadProducts()
]);
}


// ===============================
// UPDATE RESTAURANT INFO
// ===============================

function updateRestaurantInfo() {

    if (!restaurant) return;


    /* =========================
       RESTAURANT NAME
    ========================= */

    const heroTitle =
        document.querySelector(".hero h1");

    if (heroTitle) {

        const restaurantName =
            restaurant.name || "مطعم جنين";

        heroTitle.innerHTML = `
            ${restaurantName}
            <span>JENIN RESTAURANT</span>
        `;

    }


    /* =========================
       HERO DESCRIPTION
    ========================= */

    const heroDescription =
        document.querySelector(".hero-description");

    if (heroDescription) {

        heroDescription.textContent =
            restaurant.description ||
            "شاورما ومشاوي وحلويات بطعم مميز في قلب النصيرات";

    }


    /* =========================
       HERO BADGE
    ========================= */

    const heroBadge =
        document.getElementById("heroBadgeText");

    if (heroBadge) {

        heroBadge.textContent =
            restaurant.hero_badge_text ||
            "اللمة عنا غير";

    }
  
    /* =========================
       HERO LOCATION
    ========================= */

    const heroInfoItems =
        document.querySelectorAll(".hero-info-item");

    if (heroInfoItems.length > 0) {

        const locationItem =
            heroInfoItems[0];

        const locationText =
            locationItem.querySelector("div span");

        if (locationText) {

            locationText.textContent =
                restaurant.address ||
                restaurant.area ||
                "النصيرات - الدوار العام";

        }

    }


    /* =========================
       PHONE
    ========================= */

    const phoneLinks =
        document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {

        if (restaurant.phone) {

            link.href =
                `tel:${restaurant.phone}`;

            if (
                link.textContent.trim() ===
                "0595864888"
            ) {

                link.textContent =
                    restaurant.phone;

            }

        }

    });


    /* =========================
       WHATSAPP
    ========================= */

    const whatsappLinks =
        document.querySelectorAll('a[href*="wa.me"]');

    whatsappLinks.forEach(link => {

        if (restaurant.whatsapp) {

            let number =
                restaurant.whatsapp.replace(/\D/g, "");

            if (number.startsWith("059")) {

                number =
                    "970" +
                    number.substring(1);

            }

            link.href =
                `https://wa.me/${number}`;

        }

    });


    /* =========================
       INSTAGRAM
    ========================= */

    const instagramLink =
        document.getElementById("instagramLink");

    if (instagramLink) {

        if (restaurant.instagram) {

            instagramLink.href =
                restaurant.instagram;

            instagramLink.style.display =
                "inline-flex";

        } else {

            instagramLink.style.display =
                "none";

        }

    }


    /* =========================
       FACEBOOK
    ========================= */

    const facebookLink =
        document.getElementById("facebookLink");

    if (facebookLink) {

        if (restaurant.facebook) {

            facebookLink.href =
                restaurant.facebook;

            facebookLink.style.display =
                "inline-flex";

        } else {

            facebookLink.style.display =
                "none";

        }

    }


    /* =========================
       WORKING HOURS
    ========================= */

    const workingHoursText =
        document.getElementById("workingHoursText");

    if (workingHoursText) {

        workingHoursText.textContent =
            restaurant.working_hours ||
            "لم يتم تحديد أوقات العمل";

    }


    /* =========================
       CONTACT ADDRESS
    ========================= */

    const contactCards =
        document.querySelectorAll(".contact-card");

    contactCards.forEach(card => {

        const title =
            card.querySelector("h3");

        if (
            title &&
            title.textContent.trim() === "موقعنا"
        ) {

            const paragraph =
                card.querySelector("p");

            if (paragraph) {

                const address =
                    restaurant.address ||
                    restaurant.area ||
                    "النصيرات - الدوار العام";

                paragraph.innerHTML =
                    address.replace(
                        / - /g,
                        "<br>"
                    );

            }

        }

    });


    /* =========================
       FOOTER PHONE
    ========================= */

    const footerPhone =
        document.querySelector(
            ".footer-contact a[href^='tel:']"
        );

    if (
        footerPhone &&
        restaurant.phone
    ) {

        footerPhone.href =
            `tel:${restaurant.phone}`;

        footerPhone.textContent =
            `📞 ${restaurant.phone}`;

    }


    /* =========================
       FOOTER ADDRESS
    ========================= */

    const footerAddress =
        document.querySelector(
            ".footer-contact span"
        );

    if (
        footerAddress &&
        (restaurant.address ||
         restaurant.area)
    ) {

        footerAddress.textContent =
            `📍 ${
                restaurant.address ||
                restaurant.area
            }`;

    }


    /* ===============================
       RESTAURANT HERO IMAGE
    =============================== */

    const hero =
        document.querySelector(".hero");

    if (
        hero &&
        restaurant.image_url
    ) {

        hero.style.backgroundImage =
            `url("${restaurant.image_url}")`;

        hero.style.backgroundSize =
            "cover";

        hero.style.backgroundPosition =
            "center";

    }

}

// ===============================
// LOAD GALLERY
// ===============================

async function loadGallery() {

    const galleryGrid =
        document.getElementById("galleryGrid");

    if (!galleryGrid) return;

    if (!restaurant || !restaurant.id) {
        return;
    }

    const {
        data,
        error
    } = await supabaseClient
        .from("gallery")
        .select("*")
        .eq(
            "restaurant_id",
            restaurant.id
        )
        .eq(
            "is_active",
            true
        )
        .order(
            "sort_order",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Gallery loading error:",
            error
        );

        return;
    }


    galleryGrid.innerHTML = "";


    if (!data || data.length === 0) {

        galleryGrid.innerHTML = `
            <p
                style="
                    grid-column:1/-1;
                    text-align:center;
                    color:#aaa;
                "
            >
                لا توجد صور في المعرض حاليًا
            </p>
        `;

        return;
    }


    data.forEach(function (image, index) {

        const item =
            document.createElement("div");

        item.className =
            "gallery-item";


        if (index === 0) {

            item.classList.add(
                "gallery-large"
            );

        }


        item.innerHTML = `
            <img
                src="${image.image_url}"
                alt="${image.title || "مطعم جنين"}"
                loading="lazy"
                decoding="async"
            >
        `;


        galleryGrid.appendChild(item);

    });

}

// ===============================
// LOAD CATEGORIES
// ===============================

async function loadCategories() {

    const { data, error } = await supabaseClient
        .from("categories")
        .select("*")
        .order("sort_order", {
            ascending: true
        });

    if (error) {

        console.error(
            "Categories error:",
            error
        );

        return;
    }

    categories = data || [];

    renderCategories();
}


// ===============================
// RENDER CATEGORIES
// ===============================

function renderCategories() {

    const container =
        document.getElementById("menuCategories");

    if (!container) return;

    container.innerHTML = "";

    // الكل
    const allButton =
        document.createElement("button");

    allButton.className =
        "category-btn active";

    allButton.dataset.category = "all";

    allButton.textContent = "الكل";

    allButton.addEventListener(
        "click",
        () => {

            selectedCategory = "all";

            updateCategoryButtons();

            renderProducts();
        }
    );

    container.appendChild(allButton);


    // التصنيفات
    categories.forEach(category => {

        const button =
            document.createElement("button");

        button.className =
            "category-btn";

        button.dataset.category =
            String(category.id);

        button.textContent =
            category.name;

        button.addEventListener(
            "click",
            () => {

                selectedCategory =
                    String(category.id);

                updateCategoryButtons();

                renderProducts();
            }
        );

        container.appendChild(button);

    });
}


// ===============================
// CATEGORY BUTTONS
// ===============================

function updateCategoryButtons() {

    document
        .querySelectorAll(".category-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category ===
                selectedCategory
            );

        });
}


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

    if (!restaurant) return;

    const { data, error } =
    await supabaseClient
        .from("products")
        .select("*")
      .eq("restaurant_id", restaurant.id)
        .eq("available", true)
        .order("sort_order", {
            ascending: true
        });

    if (error) {

        console.error(
            "Products error:",
            error
        );

        return;
    }

    products = data || [];

    console.log(
        "Products loaded:",
        products
    );

    renderProducts();
}


// ===============================
// RENDER PRODUCTS
// ===============================

function renderProducts() {

    const grid =
        document.getElementById(
            "productsGrid"
        );

    const noResults =
        document.getElementById(
            "noResults"
        );

    if (!grid) return;

    const filtered =
        products.filter(product => {

            const categoryMatch =
                selectedCategory === "all" ||
                String(product.category_id) ===
                String(selectedCategory);

            const searchMatch =
                !searchText ||
                String(product.name || "")
                    .toLowerCase()
                    .includes(
                        searchText.toLowerCase()
                    ) ||
                String(product.description || "")
                    .toLowerCase()
                    .includes(
                        searchText.toLowerCase()
                    );

            return (
                categoryMatch &&
                searchMatch
            );

        });


    grid.innerHTML = "";


    if (filtered.length === 0) {

        if (noResults) {
            noResults.style.display = "block";
        }

        return;

    }


    if (noResults) {
        noResults.style.display = "none";
    }


    filtered.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        const image =
            product.image_url ||
            "";


        card.innerHTML = `

            <div class="product-image">

                ${
                    image
                    ? `
                        <img
                            src="${image}"
                            alt="${escapeHTML(product.name || "")}"
                            loading="lazy"
                            decoding="async"
                        >
                    `
                    : `
                        <div class="product-no-image">
                            <span>🍽️</span>
                            <small>صورة الصنف</small>
                        </div>
                    `
                }

            </div>


            <div class="product-content">

                ${
                    product.featured
                    ? `
                        <span class="product-badge">
                            ⭐ مميز
                        </span>
                    `
                    : ""
                }


                <h3>
                    ${escapeHTML(product.name || "")}
                </h3>


                ${
                    product.description
                    ? `
                        <p>
                            ${escapeHTML(
                                product.description
                            )}
                        </p>
                    `
                    : ""
                }


                <div class="product-bottom">

                    <span class="product-price">
                        ${product.price ?? ""} ₪
                    </span>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


// ===============================
// SEARCH
// ===============================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "menuSearch"
        );

    if (!searchInput) return;

    searchInput.addEventListener(
        "input",
        function () {

            searchText =
                this.value.trim();

            renderProducts();

        }
    );
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// MOBILE MENU
// ===============================

function setupMobileMenu() {

    const toggle =
        document.getElementById(
            "menuToggle"
        );

    const menu =
        document.getElementById(
            "mobileMenu"
        );

    if (!toggle || !menu) return;

    toggle.addEventListener(
        "click",
        () => {

            menu.classList.toggle("open");

        }
    );


    menu.querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    menu.classList.remove(
                        "open"
                    );

                }
            );

        });

}


// ===============================
// BACK TO TOP
// ===============================

function setupBackToTop() {

    const button =
        document.getElementById(
            "backToTop"
        );

    if (!button) return;

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 500) {

                button.classList.add(
                    "show"
                );

            } else {

                button.classList.remove(
                    "show"
                );

            }

        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


// ===============================
// CURRENT YEAR
// ===============================

function setupYear() {

    const year =
        document.getElementById(
            "currentYear"
        );

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }

}


// ===============================
// START
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setupMobileMenu();

        setupSearch();

        setupBackToTop();

        setupYear();

        await loadRestaurant();

        console.log(
            "Jenin Restaurant loaded successfully"
        );

    }
);