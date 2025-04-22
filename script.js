const BASE_URL = 'https://script.google.com/macros/s/AKfycbxp_LTcQIhxTvxaWN5xiYhMxqM-cOAN9LgOGC03xBHPrQxuko4TXAdJqY0KwBbqCUS2/exec';

document.addEventListener('DOMContentLoaded', () => {
  const typeSelect = document.getElementById('type');
  const filiereSelect = document.getElementById('filiere');

  const filieres = {
    Parrain: ["Telecom", "Informatique"],
    Filleul: ["SRT", "GLSI"]
  };

  function updateFilieres() {
    if (!typeSelect || !filiereSelect) return;
    const selectedType = typeSelect.value;
    const options = filieres[selectedType] || [];

    filiereSelect.innerHTML = "";
    options.forEach(f => {
      const option = document.createElement('option');
      option.value = f;
      option.textContent = f;
      filiereSelect.appendChild(option);
    });
  }

  // --- Enregistrement sans image ---
  const form = document.getElementById('enregistrement-form');
  if (form && typeSelect && filiereSelect) {
    updateFilieres();
    typeSelect.addEventListener('change', updateFilieres);

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Envoi...';

      const formData = new FormData(form);

      fetch(BASE_URL, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Enregistrement effectué avec succès!');
          form.reset();
          updateFilieres();
        } else {
          alert('Cet email est déjà inscrit, et votre nom existe dans la base');
        }
      })
      .catch(() => alert("Erreur lors de l'enregistrement"))
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Envoyer';
      });
    });
  }

  // --- Consultation Filleul ---
  const consultFiForm = document.getElementById('consultationfi-form');
  if (consultFiForm) {
    consultFiForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const submitBtn = consultFiForm.querySelector('button[type="submit"]');
      const loader = document.getElementById('loading-indicator');

      submitBtn.disabled = true;
      if (loader) loader.style.display = 'inline';

      fetch(`${BASE_URL}?email=${encodeURIComponent(email)}&role=Filleul`)
        .then(response => response.json())
        .then(data => {
          if (data.nom) {
            document.getElementById('parrain-info').style.display = 'block';
            document.getElementById('parrain-nom').textContent = `Nom: ${data.nom} ${data.prenom}`;
            document.getElementById('parrain-whatsapp').textContent = `WhatsApp: ${data.whatsapp}`;
          } else {
            alert('Aucun parrain trouvé pour cet email.');
          }
        })
        .catch(() => alert("Erreur lors de la consultation"))
        .finally(() => {
          submitBtn.disabled = false;
          if (loader) loader.style.display = 'none';
        });
    });
  }

  // --- Consultation Parrain ---
  const consultPForm = document.getElementById('consultationP-form');
  if (consultPForm) {
    consultPForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const submitBtn = consultPForm.querySelector('button[type="submit"]');
      const loader = document.getElementById('loading-indicator');

      submitBtn.disabled = true;
      if (loader) loader.style.display = 'inline';

      fetch(`${BASE_URL}?email=${encodeURIComponent(email)}&role=Parrain`)
        .then(response => response.json())
        .then(data => {
          if (data.filleuls && data.filleuls.length > 0) {
            const filleulsList = document.getElementById('filleuls-list');
            filleulsList.innerHTML = '';
            data.filleuls.forEach(filleul => {
              const div = document.createElement('div');
              div.innerHTML = `
                <p>${filleul.nom} ${filleul.prenom}</p>
                <p>WhatsApp: ${filleul.whatsapp}</p>
              `;
              filleulsList.appendChild(div);
            });
            document.getElementById('filleuls-info').style.display = 'block';
          } else {
            alert('Aucun filleul trouvé pour cet email.');
          }
        })
        .catch(() => alert("Erreur lors de la consultation"))
        .finally(() => {
          submitBtn.disabled = false;
          if (loader) loader.style.display = 'none';
        });
    });
  }
});
