document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  fetch("https://script.google.com/macros/s/AKfycbzGXzuZm8n2XAu93n3ExqvidKqCWBXQEGz9ujz780czdh4gM3UudKADeriaKcnvls7D3g/exec", {
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
