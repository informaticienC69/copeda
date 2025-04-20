const scriptURL = "https://script.google.com/macros/s/AKfycbyHqsb46_tHA_lFJOYxRRvmVRj0nBGRLc1qeAWt2ZWWS3vwigif_KXaHKuNNjI1AImxpQ/exec";
const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  fetch(scriptURL, {
    method: "POST",
    body: formData
  })
    .then((response) => {
      alert("Inscription réussie !");
      form.reset(); // Réinitialise le formulaire
    })
    .catch((error) => {
      alert("Une erreur s'est produite. Veuillez réessayer.");
      console.error("Erreur :", error);
    });
});
