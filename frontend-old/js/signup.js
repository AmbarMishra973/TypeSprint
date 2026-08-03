const form = document.getElementById("signupForm");

const password = document.getElementById("password");

const confirmPassword = document.getElementById("confirmPassword");

const toggle = document.getElementById("togglePassword");



toggle.onclick = () => {


    password.type =
        password.type === "password"
        ? "text"
        : "password";


};



form.addEventListener("submit", async (e)=>{


    e.preventDefault();



    const message = document.getElementById("message");



    if(password.value !== confirmPassword.value){


        message.innerText = "Passwords do not match.";

        return;

    }



    try{


        const response = await fetch(
            "http://localhost:8080/api/auth/signup",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify({

                    name:
                    document.getElementById("name").value,


                    email:
                    document.getElementById("email").value,


                    password:
                    password.value


                })


            }

        );



        if(response.ok){


            message.style.color="#86efac";

            message.innerText=
            "Account created! Redirecting...";


            setTimeout(()=>{


                window.location.href="login.html";


            },1500);



        }

        else{


            message.innerText=
            "Signup failed.";

        }



    }


    catch(error){


        message.innerText=
        "Server connection failed.";


        console.log(error);


    }



});