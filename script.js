document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => data[key] = value);
fetch("https://script.google.com/macros/s/AKfycbyHqsb46_tHA_lFJOYxRRvmVRj0nBGRLc1qeAWt2ZWWS3vwigif_KXaHKuNNjI1AImxpQ/exec", {
    method: "POST",
    body: JSON.stringify(data)
  }).then(res => res.json()).then(res => {
    alert("Enregistrement réussi !");
    document.getElementById('form').reset();
  });
});
