document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  fetch("https://script.google.com/macros/s/AKfycbyHqsb46_tHA_lFJOYxRRvmVRj0nBGRLc1qeAWt2ZWWS3vwigif_KXaHKuNNjI1AImxpQ/exec", {
    method: "POST",
    body: formData
  })
  .then(res => res.text())
  .then(res => {
    alert("Enregistrement réussi !");
    document.getElementById('form').reset();
  })
  .catch(err => {
    alert("Une erreur est survenue !");
    console.error(err);
  });
});
