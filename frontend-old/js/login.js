const form = document.getElementById("loginForm");

const toggle = document.getElementById("togglePassword");

const password = document.getElementById("password");

toggle.onclick = () => {

    password.type =
        password.type === "password"
            ? "text"
            : "password";

};

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/auth/login", {

        method: "POST",

        headers: {

            "Content-Type":"application/json"

        },

        body: JSON.stringify({

            email:document.getElementById("email").value,

            password:password.value

        })

    });

    const message = document.getElementById("message");

    if(response.ok){

        window.location.href="index.html";

    }

    else{

        message.innerText="Invalid email or password.";

    }

});