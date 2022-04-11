const toggle = document.querySelector(".toggle-register")
toggle.addEventListener('click', (evt) => {
  toggleForm(evt);
})
function toggleForm (evt) {
  const loginForm = document.querySelector(".login-form");
  const registerForm = document.querySelector(".register-form");
  const loginVisible = registerForm.classList.contains("form-hidden");

  if (loginVisible) {
    loginForm.classList.add("form-hidden");
    registerForm.classList.remove("form-hidden");
    toggle.innerHTML = "Already have an account? Login"
  } else {
    loginForm.classList.remove("form-hidden");
    registerForm.classList.add("form-hidden");
    toggle.innerHTML = "Don't have an account? Register"
  }
}