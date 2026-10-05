// SIGNUP

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message = document.getElementById("signupMessage");

        if (password !== confirmPassword) {

            message.textContent = "Passwords do not match.";
            message.style.color = "#f87171";

            return;
        }

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        const existingUser =
            users.find(user => user.email === email);

        if (existingUser) {

            message.textContent =
                "An account with this email already exists.";

            message.style.color = "#f87171";

            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        message.textContent =
            "Account created successfully!";

        message.style.color = "#4ade80";

        signupForm.reset();

        setTimeout(function() {

            window.location.href = "login.html";

        }, 1200);

    });
}


// LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");

        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(
            user =>
                user.email === email &&
                user.password === password
        );

        if (user) {

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );

            window.location.href =
                "user-dashboard.html";

        } else {

            message.textContent =
                "Invalid email or password.";

            message.style.color = "#f87171";
        }

    });
}