(() => {
  const registerFrom = document.getElementById("register-form");

  registerFrom.addEventListener(
    "submit",
    (event) => {
      const firstPass = document.getElementById("password");
      const secondPass = document.getElementById("cfmpassword");

      if (firstPass.value != secondPass.value) {
        secondPass.value = "";
        if (!registerFrom.checkValidity()) {
          document.getElementById("password-err").style.display = "block";
          event.preventDefault();
          event.stopPropagation();
        }
      }

      registerFrom.classList.add("was-validated");
    },
    false
  );
})();
