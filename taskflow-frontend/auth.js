const API_BASE =
    "http://localhost:8080/auth";


// INPUTS
const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");


// BUTTONS
const registerBtn =
    document.getElementById("registerBtn");

const loginBtn =
    document.getElementById("loginBtn");


// REGISTER
registerBtn.addEventListener("click", () => {

    const user = {

        name: nameInput.value,

        email: emailInput.value,

        password: passwordInput.value
    };


    fetch(`${API_BASE}/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    })
    .then(response => response.text())

    .then(data => {

        alert(data);
    });
});


// LOGIN
loginBtn.addEventListener("click", () => {

    const user = {

        email: emailInput.value,

        password: passwordInput.value
    };


    fetch(`${API_BASE}/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    })
    .then(response => response.json())

    .then(data => {

        if (!data) {

            alert("Invalid credentials");

            return;
        }


        // STORE USER
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(data)
        );


        // REDIRECT
        window.location.href = "dashboard.html";

    });
});