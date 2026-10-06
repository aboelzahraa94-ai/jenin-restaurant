const SUPABASE_URL =
    "https://umypydotylxxdgpofqfn.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_VIoDDn2SB5qQM0YUa0-1hg_zrdthjm2";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const email =
            document.getElementById(
                "loginEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "loginPassword"
            ).value;


        loginMessage.textContent =
            "جاري تسجيل الدخول...";

        loginMessage.style.color =
            "#f1d58a";


        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            console.error(
                "Login error:",
                error
            );

            loginMessage.textContent =
                "❌ البريد الإلكتروني أو كلمة المرور غير صحيحة";

            loginMessage.style.color =
                "#ff6b6b";

            return;
        }


        console.log(
            "Login successful:",
            data
        );


        loginMessage.textContent =
            "✅ تم تسجيل الدخول بنجاح";

        loginMessage.style.color =
            "#7ee787";


        setTimeout(
            function() {

                window.location.href =
                    "admin-dashboard.html";

            },
            800
        );

    }
);