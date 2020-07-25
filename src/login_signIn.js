import dataService from "./dataService.js"
import { getDataLS, setDataLS } from "./localStorage.js"
document.addEventListener("DOMContentLoaded", () => {
    let registeSection = document.querySelector(".register_section");
    let login_section = document.querySelector(".login_section")
    let showRegisterFormBtn = document.querySelector(".create_account");
    let showLoginFormBtn = document.querySelector(".sign_in");
    let loginForm = document.querySelector(".login_form");
    let registerForm = document.querySelector(".register_form")
    let invalidInfo = document.querySelector(".invalid_info")
    let emailInput = document.querySelector("[type = 'email']");
    let passwordInput = document.querySelector("[type = 'password']")
    let nameInput = document.getElementById("register_name");
    let regEmailInput = document.getElementById("register_email");
    let regPWInput = document.getElementById("register_password")
    let confirmPwInput = document.getElementById("confirm_password");


    function invalidFormInput(input) {
        input.classList.add("is_invalid")
        input.parentElement.querySelector(".invalid_feedback").style.visibility = "visible"
    }
    function removeInvalid(input) {
        input.classList.remove("is_invalid");
        input.parentElement.querySelector(".invalid_feedback").style.visibility = "hidden"
    }

    loginForm.addEventListener("submit", function login(e) {
        invalidInfo.style.display = "none"
        e.preventDefault()
        let email = emailInput.value;
        let password = passwordInput.value
        if (!validateForm(this)) {
            return;
        }

        dataService.getUser(`?email=${email}&password=${password}`)
            .then(data => {

                if (data[0].length == 0) {
                    invalidInfo.style.display = "block"
                }
                else {
                    if (data[0].cart) {

                        let { cart, totalPrice } = getDataLS();
                        cart.forEach(elm => {
                            let flag = 0;
                            data[0].cart.cart.forEach(savedElm => {
                                if (elm.id == savedElm.id) {
                                    savedElm.qty += elm.qty
                                    flag++
                                }

                            })
                            if (flag === 0) {
                                data[0].cart.cart.push(elm)
                            }
                        })
                        data[0].cart.totalPrice += totalPrice

                        setDataLS(data[0].cart)
                    }
                    else {
                        let userData = getDataLS();
                        userData.userId = data[0].id;
                        userData.userName = data[0].name;
                        setDataLS(userData)
                    }
                    window.location.replace("index.html");

                }
            })

    })


    registerForm.addEventListener("submit", function register(e) {
        e.preventDefault();
        let formData = new FormData(this)

        if (!registerValidate(this)) {
            return;
        }
        // check if the email exist
        dataService.getUser(`?email=${formData.get("user_email")}`)
            .then(data => {
                if (data.length == 0) {
                    let invalidInfo = document.querySelector(".register_form .invalid_info")
                    invalidInfo.children[0].innerHTML = "Email is already Exist <a href='' style='color :black' >Forget Password ?</a>"
                    invalidInfo.style.display = "block"
                    return;
                }
                else {
                    dataService.registerUser(nameInput.value, regEmailInput.value, regPWInput.value)
                        .then(data => {
                            let userData = getDataLS();
                            userData.userId = data.id;
                            userData.userName = data.name;
                            setDataLS(userData)
                            window.location.replace("index.html");

                        })
                }
            })
    })

    //show the register section
    showRegisterFormBtn.addEventListener("click", (e) => {
        e.preventDefault()
        login_section.style.display = "none";
        registeSection.style.display = "block"
    })

    // show login section
    showLoginFormBtn.addEventListener("click", e => {
        e.preventDefault();
        login_section.style.display = "block";
        registeSection.style.display = "none";
    })




    // validate Login inputs
    let emailRegex = new RegExp(/[^@]+@[^.]+\..+/);
    let nameRegex = new RegExp(/^[A-Za-z]/);
    function validateForm(form) {

        let email = emailInput.value
        let password = passwordInput.value

        if (!email && !emailRegex.test(email)) {
            invalidFormInput(emailInput);
        }

        if (!password) {
            invalidFormInput(passwordInput);
        }
        let invalidElements = form.querySelectorAll(".is_invalid");

        if (invalidElements.length > 0) {
            invalidElements.forEach(elm => {
                elm.addEventListener("input", () => {
                    removeInvalid(elm)
                })
            })

            return false;
        }
        return true;
    }

    // validate registeration inputs
    function registerValidate(form) {

        if (!nameInput.value || !nameRegex.test(nameInput.value)) {
            invalidFormInput(nameInput)
        }
        if (!regEmailInput.value || !emailRegex.test(regEmailInput.value)) {
            invalidFormInput(regEmailInput)
        }
        if (!(regPWInput.value.length > 5)) {
            invalidFormInput(regPWInput)
        }
        if (!confirmPwInput.value || confirmPwInput.value !== regPWInput.value) {
            invalidFormInput(confirmPwInput)
        }

        let invalidElements = form.querySelectorAll(".is_invalid");

        if (invalidElements.length > 0) {
            invalidElements.forEach(elm => {
                elm.addEventListener("input", () => {
                    removeInvalid(elm)
                })
            })

            return false;
        }
        return true;
    }
})
