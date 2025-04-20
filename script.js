document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  fetch("https://script.google.com/macros/s/AKfycbwh4z8-0U-j1s6izAqMsP-zuLwkzjmEiYKD1T5jaFfJbBu3uza1k_wBavJEa59otRq9/exec", {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    alert("Enregistrement réussi !");
    document.getElementById('form').reset();
  })
  .catch(error => {
    alert("Erreur lors de l'enregistrement.");
    console.error(error);
  });
});
