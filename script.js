document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);  
  fetch("https://script.google.com/macros/s/AKfycbwBjRjlxRiZslDaAL1JS9pDN2LyMJ7-NBQk_P_ZvCOvWpxyEBojBidNW1_WbeY_znhkUA/exec", {
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
