const SUPABASE_URL =
            "https://umypydotylxxdgpofqfn.supabase.co";

        const SUPABASE_KEY =
            "sb_publishable_VIoDDn2SB5qQM0YUa0-1hg_zrdthjm2";


        const supabaseClient =
            supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        async function checkAdmin() {

    const {
        data,
        error
    } = await supabaseClient.auth.getUser();

    if (
        error ||
        !data ||
        !data.user
    ) {
        window.location.href = "admin.html";
        return false;
    }

    console.log(
        "Admin:",
        data.user.email
    );

    return true;
}


document.getElementById(
    "logoutButton"
).addEventListener(
    "click",
    async function() {

        await supabaseClient.auth.signOut();

        window.location.href =
            "admin.html";

    }
);


        // ===============================
        // CATEGORIES
        // ===============================

        let categories = [];


        function escapeHTML(value) {

            return String(value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        }


        async function loadCategories() {

            const {
                data,
                error
            } = await supabaseClient
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
const count = document.getElementById("categoriesCount");

if (count) {
    count.textContent = categories.length;
      }
            renderCategories();

        }

function openCategoryModal() {

    const modal =
        document.getElementById(
            "categoryModal"
        );

    const id =
        document.getElementById(
            "categoryId"
        );

    const name =
        document.getElementById(
            "categoryName"
        );

    const message =
        document.getElementById(
            "categoryMessage"
        );

    if (id) {
        id.value = "";
    }

    if (name) {
        name.value = "";
    }

    if (message) {
        message.textContent = "";
    }

    document.getElementById(
        "categoryModalTitle"
    ).textContent =
        "➕ إضافة تصنيف";

    if (modal) {
        modal.style.display = "flex";
    }
      }
      
        function renderCategories() {

            const container =
                document.getElementById(
                    "categoriesList"
                );


            if (!container) return;


            if (categories.length === 0) {

                container.innerHTML = `
                    <p style="
                        color:#aaa49a;
                        text-align:center;
                    ">
                        لا توجد تصنيفات حتى الآن
                    </p>
                `;

                return;

            }


            container.innerHTML = "";


            categories.forEach(category => {

                const item =
                    document.createElement("div");


                item.style.cssText = `
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:15px;
                    padding:15px;
                    margin-bottom:10px;
                    background:#0d0c0a;
                    border:1px solid #302c27;
                    border-radius:12px;
                `;


                item.innerHTML = `

                    <div>

                        <strong
                            style="
                                color:#f8f5ee;
                                font-size:17px;
                            "
                        >
                            ${escapeHTML(category.name || "")}
                        </strong>

                        <div
                            style="
                                color:#777;
                                font-size:13px;
                                margin-top:5px;
                            "
                        >
                            الترتيب:
                            ${category.sort_order ?? 0}
                        </div>

                    </div>


                    <div
                        style="
                            display:flex;
                            gap:8px;
                        "
                    >

                        
                            <button
    data-action="edit-category"
    data-id="${category.id}"
    style="
        padding:8px 12px;
        border:0;
        border-radius:8px;
        background:#2c2924;
        color:#f1d58a;
        cursor:pointer;
    "
>
    ✏️
</button>


<button
    data-action="delete-category"
    data-id="${category.id}"
    style="
        padding:8px 12px;
        border:0;
        border-radius:8px;
        background:#3a1917;
        color:#ff8b83;
        cursor:pointer;
    "
>
                            🗑️
                        </button>

                    </div>

                `;


                container.appendChild(item);

            });

        }


        function openCategoryModal() {

            document.getElementById(
                "categoryModal"
            ).style.display = "flex";


            document.getElementById(
                "categoryModalTitle"
            ).textContent =
                "➕ إضافة تصنيف";


            document.getElementById(
                "categoryId"
            ).value = "";


            document.getElementById(
                "categoryName"
            ).value = "";


            document.getElementById(
                "categorySort"
            ).value =
                categories.length;


            document.getElementById(
                "categoryMessage"
            ).textContent = "";

        }


        function closeCategoryModal() {

            document.getElementById(
                "categoryModal"
            ).style.display = "none";

        }


        function editCategory(id) {

            const category =
                categories.find(
                    item =>
                        Number(item.id) ===
                        Number(id)
                );


            if (!category) return;


            document.getElementById(
                "categoryModal"
            ).style.display = "flex";


            document.getElementById(
                "categoryModalTitle"
            ).textContent =
                "✏️ تعديل التصنيف";


            document.getElementById(
                "categoryId"
            ).value =
                category.id;


            document.getElementById(
                "categoryName"
            ).value =
                category.name || "";


            document.getElementById(
                "categorySort"
            ).value =
                category.sort_order ?? 0;

        }


        async function saveCategory() {

            const id =
                document.getElementById(
                    "categoryId"
                ).value;


            const name =
                document.getElementById(
                    "categoryName"
                ).value.trim();


            const sortOrder =
                Number(
                    document.getElementById(
                        "categorySort"
                    ).value
                );


            const message =
                document.getElementById(
                    "categoryMessage"
                );


            if (!name) {

                message.textContent =
                    "❌ اكتب اسم التصنيف";

                message.style.color =
                    "#ff6b6b";

                return;

            }


            message.textContent =
                "جاري الحفظ...";


            let result;


            if (id) {

                result =
                    await supabaseClient
                        .from("categories")
                        .update({
                            name: name,
                            sort_order: sortOrder
                        })
                        .eq("id", id);

            } else {

                result =
                    await supabaseClient
                        .from("categories")
                        .insert({
                            name: name,
                            sort_order: sortOrder
                        });

            }


            if (result.error) {

                console.error(
                    result.error
                );

                message.textContent =
                    "❌ حدث خطأ أثناء الحفظ";

                message.style.color =
                    "#ff6b6b";

                return;

            }


            message.textContent =
                "✅ تم الحفظ";


            await loadCategories();


            setTimeout(
                closeCategoryModal,
                500
            );

        }


        async function deleteCategory(id) {

            const confirmed =
                confirm(
                    "هل أنت متأكد من حذف هذا التصنيف؟"
                );


            if (!confirmed) return;


            const {
                error
            } = await supabaseClient
                .from("categories")
                .delete()
                .eq("id", id);


            if (error) {

                console.error(error);

                alert(
                    "حدث خطأ أثناء الحذف"
                );

                return;

            }


            await loadCategories();

        }


        document.getElementById(
            "addCategoryButton"
        ).addEventListener(
            "click",
            openCategoryModal
        );

document.getElementById("categoriesList").addEventListener("click", function (e) {

    const button = e.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.action === "edit-category") {
        editCategory(Number(id));
    }

    if (button.dataset.action === "delete-category") {
        deleteCategory(Number(id));
    }

});


        document.getElementById(
            "closeCategoryButton"
        ).addEventListener(
            "click",
            closeCategoryModal
        );


        document.getElementById(
            "saveCategoryButton"
        ).addEventListener(
            "click",
            saveCategory
        );


        loadCategories();
      // ===============================
// RESTAURANT SETTINGS
// ===============================

let currentRestaurant = null;


async function loadRestaurantSettings() {

    const {
        data,
        error
    } = await supabaseClient
        .from("restaurants")
        .select("*")
        .eq("name", "مطعم جنين")
        .limit(1)
        .maybeSingle();


    if (error) {

        console.error(
            "Restaurant settings error:",
            error
        );

        return;

    }


    if (!data) {

        console.error(
            "لم يتم العثور على مطعم جنين"
        );

        return;

    }


    currentRestaurant = data;


    document.getElementById(
        "restaurantName"
    ).value =
        data.name || "";


    document.getElementById(
        "restaurantDescription"
    ).value =
        data.description || "";


    document.getElementById(
        "restaurantArea"
    ).value =
        data.area || "";


    document.getElementById(
        "restaurantAddress"
    ).value =
        data.address || "";


    document.getElementById(
        "restaurantPhone"
    ).value =
        data.phone || "";


    document.getElementById(
        "restaurantWhatsapp"
    ).value =
        data.whatsapp || "";


    document.getElementById(
        "restaurantInstagram"
    ).value =
        data.instagram || "";

  document.getElementById(
    "restaurantFacebook"
).value =
    data.facebook || "";


    document.getElementById(
        "restaurantWebsite"
    ).value =
        data.website || "";

  document.getElementById("restaurantWorkingHours").value =
    data.working_hours || "";

    document.getElementById(
        "restaurantImage"
    ).value =
        data.image_url || "";

}


async function saveRestaurantSettings() {

    if (!currentRestaurant) {

        return;

    }


    const message =
        document.getElementById(
            "restaurantMessage"
        );


    message.textContent =
        "جاري الحفظ...";


    const updatedData = {

        name:
            document.getElementById(
                "restaurantName"
            ).value.trim(),

        description:
            document.getElementById(
                "restaurantDescription"
            ).value.trim() || null,

        area:
            document.getElementById(
                "restaurantArea"
            ).value.trim() || null,

        address:
            document.getElementById(
                "restaurantAddress"
            ).value.trim() || null,

        phone:
            document.getElementById(
                "restaurantPhone"
            ).value.trim() || null,

        whatsapp:
            document.getElementById(
                "restaurantWhatsapp"
            ).value.trim() || null,

        instagram:
            document.getElementById(
                "restaurantInstagram"
            ).value.trim() || null,

      facebook:
    document.getElementById(
        "restaurantFacebook"
    ).value.trim() || null,

        website:
            document.getElementById(
                "restaurantWebsite"
            ).value.trim() || null,

      working_hours:
    document.getElementById("restaurantWorkingHours").value.trim() || null,
      
        image_url:
            document.getElementById(
                "restaurantImage"
            ).value.trim() || null

    };


    const {
        error
    } = await supabaseClient
        .from("restaurants")
        .update(updatedData)
        .eq(
            "id",
            currentRestaurant.id
        );


    if (error) {

        console.error(
            "Save restaurant error:",
            error
        );

        message.textContent =
            "❌ حدث خطأ أثناء الحفظ";

        message.style.color =
            "#ff6b6b";

        return;

    }


    currentRestaurant = {
        ...currentRestaurant,
        ...updatedData
    };


    message.textContent =
        "✅ تم حفظ بيانات المطعم";

    message.style.color =
        "#7ee787";

}


document.getElementById(
    "saveRestaurantButton"
).addEventListener(
    "click",
    saveRestaurantSettings
);


loadRestaurantSettings();

// =========== GALLERY ADMIN =================

async function loadGalleryAdmin() {

    const list =
        document.getElementById("galleryAdminList");

    if (!list) return;

    if (!currentRestaurant) {
        return;
    }

    list.innerHTML = `
        <p style="color:#aaa;">
            جاري تحميل الصور...
        </p>
    `;


    const {
        data,
        error
    } = await supabaseClient
        .from("gallery")
        .select("*")
        .eq(
            "restaurant_id",
            currentRestaurant.id
        )
        .order(
            "sort_order",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Gallery error:",
            error
        );

        list.innerHTML = `
            <p style="color:#ff7777;">
                ❌ حدث خطأ أثناء تحميل الصور
            </p>
        `;

        return;
    }


    if (!data || data.length === 0) {

        list.innerHTML = `
            <p style="color:#aaa;">
                لا توجد صور في المعرض حاليًا
            </p>
        `;

        return;
    }


    list.innerHTML = "";


    data.forEach(function (image) {

        const card =
            document.createElement("div");


        card.style.cssText = `
            background:#191714;
            border:1px solid rgba(214,168,79,.2);
            border-radius:18px;
            overflow:hidden;
        `;


        card.innerHTML = `

            <img
                src="${image.image_url}"
                alt="${image.title || "صورة المطعم"}"
                style="
                    width:100%;
                    height:180px;
                    object-fit:cover;
                    display:block;
                "
            >

            <div style="padding:15px;">

                <h3
                    style="
                        margin:0 0 8px;
                        color:#f1d58a;
                    "
                >
                    ${image.title || "بدون عنوان"}
                </h3>

                <p
                    style="
                        margin:0 0 15px;
                        color:#aaa;
                        font-size:13px;
                    "
                >
                    ${
                        image.is_active
                        ? "🟢 ظاهرة للزوار"
                        : "🔴 مخفية"
                    }
                </p>

                <div
                    style="
                        display:flex;
                        gap:8px;
                        flex-wrap:wrap;
                    "
                >

                    <button
                        type="button"
                      data-action="toggle-gallery"
data-id="${image.id}"
data-active="${image.is_active}"
                        class="admin-btn"
                    >
                        ${
                            image.is_active
                            ? "👁️ إخفاء"
                            : "👁️ إظهار"
                        }
                    </button>


                    <button
                        type="button"
                        data-action="delete-gallery"
data-id="${image.id}"
                        class="admin-btn"
                        style="
                            background:#8b2d2d;
                        "
                    >
                        🗑️ حذف
                    </button>

                </div>

            </div>
        `;


        list.appendChild(card);

    });

}


// ================= ADD IMAGE =================

async function addGalleryImage() {

    const imageInput =
        document.getElementById(
            "galleryImageFile"
        );

    const titleInput =
        document.getElementById(
            "galleryTitle"
        );

    const message =
        document.getElementById(
            "galleryMessage"
        );


    const file =
        imageInput.files[0];

    const title =
        titleInput.value.trim();


    if (!file) {

        message.textContent =
            "⚠️ اختر صورة أولًا";

        message.style.color =
            "#ff7777";

        return;
    }


    if (!currentRestaurant) {

        message.textContent =
            "❌ لم يتم تحميل بيانات المطعم";

        message.style.color =
            "#ff7777";

        return;
    }


    message.textContent =
        "⏳ جاري رفع الصورة...";

    message.style.color =
        "#f1d58a";


    try {

        const fileExtension =
            file.name.split(".").pop();

        const fileName =
            `${currentRestaurant.id}_${Date.now()}.${fileExtension}`;


        const filePath =
            `gallery/${fileName}`;


        const {
            error: uploadError
        } = await supabaseClient
            .storage
            .from("gallery")
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );


        if (uploadError) {

            console.error(
                "Gallery upload error:",
                uploadError
            );

            message.textContent =
    "❌ " + uploadError.message;
            message.style.color =
                "#ff7777";

            return;
        }


        const {
            data: publicUrlData
        } =
            supabaseClient
                .storage
                .from("gallery")
                .getPublicUrl(
                    filePath
                );


        const imageUrl =
            publicUrlData.publicUrl;


        const {
            error
        } = await supabaseClient
            .from("gallery")
            .insert([{

                restaurant_id:
                    currentRestaurant.id,

                image_url:
                    imageUrl,

                title:
                    title || null,

                sort_order:
                    0,

                is_active:
                    true

            }]);


        if (error) {

            console.error(
                "Add gallery error:",
                error
            );

            message.textContent =
                "❌ تم رفع الصورة لكن فشل حفظها";

            message.style.color =
                "#ff7777";

            return;
        }


        imageInput.value = "";
        titleInput.value = "";


        message.textContent =
            "✅ تمت إضافة الصورة بنجاح";

        message.style.color =
            "#7ee787";


        await loadGalleryAdmin();


    } catch (error) {

        console.error(
            "Gallery error:",
            error
        );

        message.textContent =
            "❌ حدث خطأ أثناء رفع الصورة";

        message.style.color =
            "#ff7777";
    }
}


// ================= TOGGLE IMAGE =================

async function toggleGalleryImage(
    id,
    currentStatus
) {

    const {
        error
    } = await supabaseClient
        .from("gallery")
        .update({

            is_active:
                !currentStatus

        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Toggle gallery error:",
            error
        );

        return;
    }


    await loadGalleryAdmin();

}


// ================= DELETE IMAGE =================

async function deleteGalleryImage(id) {

    const confirmed =
        confirm(
            "هل تريد حذف هذه الصورة؟"
        );


    if (!confirmed) return;


    const {
        error
    } = await supabaseClient
        .from("gallery")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Delete gallery error:",
            error
        );

        return;
    }


    await loadGalleryAdmin();

}


// ================= GALLERY BUTTON =================

const addGalleryButton =
    document.getElementById(
        "addGalleryButton"
    );


if (addGalleryButton) {

    addGalleryButton.addEventListener(
        "click",
        addGalleryImage
    );

}


// تحميل المعرض بعد تحميل المطعم

loadGalleryAdmin();
      
      // ===============================
// PRODUCTS
// ===============================

let products = [];


async function loadProducts() {

    const {
        data,
        error
    } = await supabaseClient
        .from("products")
        .select(`
            *,
            categories (
                name
            )
        `)
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

  const productsCount =
    document.getElementById("productsCount");

const availableProductsCount =
    document.getElementById("availableProductsCount");

if (productsCount) {
    productsCount.textContent =
        products.length;
}

if (availableProductsCount) {
    availableProductsCount.textContent =
        products.filter(
            product => product.available === true
        ).length;
      }
  
    renderProducts();

    loadProductCategories();

}


function renderProducts() {

    const container =
        document.getElementById(
            "productsList"
        );


    if (!container) return;


    if (products.length === 0) {

        container.innerHTML = `
            <p style="
                color:#aaa49a;
                text-align:center;
            ">
                لا توجد أصناف حتى الآن
            </p>
        `;

        return;

    }


    container.innerHTML = "";


    products.forEach(product => {

        const item =
            document.createElement("div");


        item.style.cssText = `
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:15px;
            padding:15px;
            margin-bottom:10px;
            background:#0d0c0a;
            border:1px solid #302c27;
            border-radius:12px;
        `;


        const categoryName =
            product.categories
                ? product.categories.name
                : "بدون تصنيف";


        item.innerHTML = `

            <div style="
                display:flex;
                align-items:center;
                gap:15px;
                min-width:0;
            ">

                ${
                    product.image_url
                    ?
                    `
                    <img
                        src="${escapeHTML(product.image_url)}"
                        style="
                            width:65px;
                            height:65px;
                            object-fit:cover;
                            border-radius:10px;
                            border:1px solid #3a352d;
                        "
                    >
                    `
                    :
                    `
                    <div style="
                        width:65px;
                        height:65px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:#25221e;
                        border-radius:10px;
                        font-size:25px;
                    ">
                        🍽️
                    </div>
                    `
                }


                <div style="min-width:0;">

                    <strong style="
                        color:#f8f5ee;
                        font-size:17px;
                    ">
                        ${escapeHTML(product.name || "")}
                    </strong>


                    <div style="
                        color:#d6a84f;
                        margin-top:5px;
                    ">
                        ${product.price ?? 0}
                    </div>


                    <div style="
                        color:#777;
                        font-size:13px;
                        margin-top:4px;
                    ">
                        ${escapeHTML(categoryName)}
                    </div>


                    ${
                        product.available
                        ?
                        `
                        <span style="
                            color:#7ee787;
                            font-size:12px;
                        ">
                            ● متوفر
                        </span>
                        `
                        :
                        `
                        <span style="
                            color:#ff8b83;
                            font-size:12px;
                        ">
                            ● غير متوفر
                        </span>
                        `
                    }

                </div>

            </div>


            <div style="
                display:flex;
                gap:8px;
                flex-shrink:0;
            ">

                <button
                    data-action="edit-product"
data-id="${product.id}"
                    style="
                        padding:8px 12px;
                        border:0;
                        border-radius:8px;
                        background:#2c2924;
                        color:#f1d58a;
                        cursor:pointer;
                    "
                >
                    ✏️
                </button>


                <button
                    data-action="delete-product"
data-id="${product.id}"
                    style="
                        padding:8px 12px;
                        border:0;
                        border-radius:8px;
                        background:#3a1917;
                        color:#ff8b83;
                        cursor:pointer;
                    "
                >
                    🗑️
                </button>

            </div>

        `;


        container.appendChild(item);

    });

}


function loadProductCategories() {

    const select =
        document.getElementById(
            "productCategory"
        );


    if (!select) return;


    select.innerHTML = `
        <option value="">
            بدون تصنيف
        </option>
    `;


    categories.forEach(category => {

        const option =
            document.createElement("option");


        option.value =
            category.id;


        option.textContent =
            category.name;


        select.appendChild(option);

    });

}


function openProductModal() {

    document.getElementById(
        "productModal"
    ).style.display = "flex";


    document.getElementById(
        "productModalTitle"
    ).textContent =
        "➕ إضافة صنف";


    document.getElementById(
        "productId"
    ).value = "";


    document.getElementById(
        "productName"
    ).value = "";


    document.getElementById(
        "productDescription"
    ).value = "";


    document.getElementById(
        "productPrice"
    ).value = "";


    document.getElementById(
        "productImage"
    ).value = "";


    document.getElementById(
        "productCategory"
    ).value = "";


    document.getElementById(
        "productSort"
    ).value =
        products.length;


    document.getElementById(
        "productAvailable"
    ).checked = true;


    document.getElementById(
        "productFeatured"
    ).checked = false;


    document.getElementById(
        "productMessage"
    ).textContent = "";

}


function closeProductModal() {

    document.getElementById(
        "productModal"
    ).style.display = "none";

}


function editProduct(id) {

    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!product) return;


    document.getElementById(
        "productModal"
    ).style.display = "flex";


    document.getElementById(
        "productModalTitle"
    ).textContent =
        "✏️ تعديل الصنف";


    document.getElementById(
        "productId"
    ).value =
        product.id;


    document.getElementById(
        "productName"
    ).value =
        product.name || "";


    document.getElementById(
        "productDescription"
    ).value =
        product.description || "";


    document.getElementById(
        "productPrice"
    ).value =
        product.price ?? "";


    document.getElementById(
        "productImage"
    ).value =
        product.image_url || "";


    document.getElementById(
        "productCategory"
    ).value =
        product.category_id || "";


    document.getElementById(
        "productSort"
    ).value =
        product.sort_order ?? 0;


    document.getElementById(
        "productAvailable"
    ).checked =
        product.available !== false;


    document.getElementById(
        "productFeatured"
    ).checked =
        product.featured === true;


    document.getElementById(
        "productMessage"
    ).textContent = "";

}

async function saveProduct() {

    const id =
        document.getElementById(
            "productId"
        ).value;


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const description =
        document.getElementById(
            "productDescription"
        ).value.trim();


    const priceValue =
        document.getElementById(
            "productPrice"
        ).value;


    let image =
    document.getElementById(
        "productImage"
    ).value.trim();

  
const imageFile =
    document.getElementById(
        "productImageFile"
    ).files[0];


    const categoryValue =
        document.getElementById(
            "productCategory"
        ).value;


    const sortOrder =
        Number(
            document.getElementById(
                "productSort"
            ).value
        );


    const available =
        document.getElementById(
            "productAvailable"
        ).checked;


    const featured =
        document.getElementById(
            "productFeatured"
        ).checked;


    const message =
        document.getElementById(
            "productMessage"
        );


    if (!name) {

        message.textContent =
            "❌ اكتب اسم الصنف";

        message.style.color =
            "#ff6b6b";

        return;

    }


    if (
        priceValue === "" ||
        Number.isNaN(Number(priceValue))
    ) {

        message.textContent =
            "❌ اكتب السعر";

        message.style.color =
            "#ff6b6b";

        return;

    }


    message.textContent =
        "جاري الحفظ...";
  let oldImageUrl = null;

if (id) {

    const {
        data: oldProduct
    } = await supabaseClient
        .from("products")
        .select("image_url")
        .eq("id", id)
        .maybeSingle();

    if (oldProduct) {
        oldImageUrl =
            oldProduct.image_url || null;
    }
      }

  // ===============================
// رفع صورة الصنف
// ===============================

if (imageFile) {

    message.textContent =
        "📤 جاري رفع الصورة...";

    const fileExt =
        imageFile.name.split(".").pop();

    const fileName =
        `product-${Date.now()}.${fileExt}`;

    const filePath =
        fileName;

    const {
        error: uploadError
    } = await supabaseClient
        .storage
        .from("products")
        .upload(
            filePath,
            imageFile,
            {
                cacheControl: "3600",
                upsert: false
            }
        );

    if (uploadError) {

        console.error(
            "Image upload error:",
            uploadError
        );

        message.textContent =
            "❌ فشل رفع الصورة";

        message.style.color =
            "#ff6b6b";

        return;
    }

    const {
        data: publicData
    } = supabaseClient
        .storage
        .from("products")
        .getPublicUrl(filePath);

    image =
        publicData.publicUrl;

  if (
    oldImageUrl &&
    oldImageUrl !== image &&
    oldImageUrl.includes(
        "/storage/v1/object/public/products/"
    )
) {

    const oldImagePath =
        oldImageUrl.split(
            "/storage/v1/object/public/products/"
        )[1];

    if (oldImagePath) {

        const {
            error: oldImageDeleteError
        } = await supabaseClient
            .storage
            .from("products")
            .remove([
                oldImagePath
            ]);

        if (oldImageDeleteError) {

            console.error(
                "Old image delete error:",
                oldImageDeleteError
            );

        }
    }
      }
  
      }

    // ===============================
    // جلب مطعم جنين
    // ===============================

    const {
        data: restaurantData,
        error: restaurantError
    } = await supabaseClient
        .from("restaurants")
        .select("id")
        .eq("name", "مطعم جنين")
        .limit(1)
        .maybeSingle();


    if (restaurantError || !restaurantData) {

        console.error(
            "Restaurant error:",
            restaurantError
        );

        message.textContent =
            "❌ لم يتم العثور على مطعم جنين";

        message.style.color =
            "#ff6b6b";

        return;

    }


    // ===============================
    // بيانات الصنف
    // ===============================

    const productData = {

        restaurant_id:
            restaurantData.id,

        name:
            name,

        description:
            description || null,

        price:
            Number(priceValue),

        image_url:
            image || null,

        category_id:
            categoryValue
                ? Number(categoryValue)
                : null,

        available:
            available,

        featured:
            featured,

        sort_order:
            sortOrder

    };


    let result;


    // ===============================
    // تعديل
    // ===============================

    if (id) {

        result =
            await supabaseClient
                .from("products")
                .update(productData)
                .eq("id", id);

    }

    // ===============================
    // إضافة
    // ===============================

    else {

        result =
            await supabaseClient
                .from("products")
                .insert(productData);

    }


    if (result.error) {

        console.error(
            "Save product error:",
            result.error
        );

        message.textContent =
            "❌ حدث خطأ أثناء الحفظ";

        message.style.color =
            "#ff6b6b";

        return;

    }


    message.textContent =
        "✅ تم الحفظ";

    message.style.color =
        "#7ee787";


    await loadProducts();


    setTimeout(
        closeProductModal,
        500
    );

}


async function deleteProduct(id) {

    const confirmed =
        confirm(
            "هل أنت متأكد من حذف هذا الصنف؟"
        );

    if (!confirmed) return;


    // ===============================
    // جلب بيانات المنتج
    // ===============================

    const {
        data: product,
        error: productError
    } = await supabaseClient
        .from("products")
        .select("image_url")
        .eq("id", id)
        .maybeSingle();


    if (productError) {

        console.error(productError);

        alert(
            "حدث خطأ أثناء جلب بيانات الصنف"
        );

        return;
    }


    // ===============================
    // حذف المنتج من قاعدة البيانات
    // ===============================

    const {
        error
    } = await supabaseClient
        .from("products")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء الحذف"
        );

        return;
    }


    // ===============================
    // حذف الصورة من Storage
    // ===============================

    if (
        product &&
        product.image_url &&
        product.image_url.includes("/storage/v1/object/public/products/")
    ) {

        const imagePath =
            product.image_url.split(
                "/storage/v1/object/public/products/"
            )[1];

        if (imagePath) {

            const {
                error: storageError
            } = await supabaseClient
                .storage
                .from("products")
                .remove([
                    imagePath
                ]);

            if (storageError) {

                console.error(
                    "Storage delete error:",
                    storageError
                );

            }
        }
    }


    await loadProducts();

}


document.getElementById(
    "addProductButton"
).addEventListener(
    "click",
    openProductModal
);


document.getElementById(
    "closeProductButton"
).addEventListener(
    "click",
    closeProductModal
);


document.getElementById(
    "saveProductButton"
).addEventListener(
    "click",
    saveProduct
);



const productImageFile =
    document.getElementById("productImageFile");

const productImagePreview =
    document.getElementById("productImagePreview");

const productImagePreviewImg =
    document.getElementById("productImagePreviewImg");

if (productImageFile) {

    productImageFile.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            productImagePreview.style.display = "none";
            productImagePreviewImg.src = "";
            return;
        }

        const imageURL =
            URL.createObjectURL(file);

        productImagePreviewImg.src = imageURL;

        productImagePreview.style.display = "block";
    });

      }

      async function initAdminDashboard() {

    if (!await checkAdmin()) return;

    await loadCategories();
    await loadRestaurantSettings();
    await loadGalleryAdmin();
    await loadProductCategories();
    await loadProducts();

}

// تشغيل أزرار الجاليري والمنتجات بدون onclick
document.addEventListener("click", function (e) {

    const button = e.target.closest("button");

    if (!button) return;

    const action = button.dataset.action;
    const id = Number(button.dataset.id);

    if (action === "toggle-gallery") {
        toggleGalleryImage(
            id,
            button.dataset.active === "true"
        );
    }

    if (action === "delete-gallery") {
        deleteGalleryImage(id);
    }

    if (action === "edit-product") {
        editProduct(id);
    }

    if (action === "delete-product") {
        deleteProduct(id);
    }

});

initAdminDashboard();
      