// ADMIN LOGIN

const adminLoginForm =
    document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("adminEmail").value;

        const password =
            document.getElementById("adminPassword").value;

        const message =
            document.getElementById("adminMessage");


        // DEMO ADMIN ACCOUNT

        const adminEmail = "admin@skycast.com";
        const adminPassword = "admin123";


        if (
            email === adminEmail &&
            password === adminPassword
        ) {

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            window.location.href =
                "admin-dashboard.html";

        } else {

            message.textContent =
                "Invalid admin email or password.";

            message.style.color = "#f87171";
        }

    });
}


// ADMIN LOGOUT

function adminLogout() {

    localStorage.removeItem("adminLoggedIn");

    window.location.href =
        "admin-login.html";
}


// ADMIN DASHBOARD

const usersList =
    document.getElementById("usersList");

if (usersList) {

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    document.getElementById("userCount").textContent =
        users.length;


    if (users.length === 0) {

        usersList.innerHTML = `
            <div class="user-row">
                <span>No registered users</span>
                <span>-</span>
                <span>-</span>
            </div>
        `;

    } else {

        usersList.innerHTML = users.map(
            (user, index) => `

            <div class="user-row">

                <span>${user.name}</span>

                <span>${user.email}</span>

                <button
                    class="delete-user"
                    onclick="deleteUser(${index})">
                    Delete
                </button>

            </div>

            `
        ).join("");
    }
}


// DELETE USER

function deleteUser(index) {

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    users.splice(index, 1);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    location.reload();
}

// PROTECT ADMIN DASHBOARD

if (
    window.location.pathname.includes("admin-dashboard.html") &&
    localStorage.getItem("adminLoggedIn") !== "true"
) {
    window.location.href = "admin-login.html";
}