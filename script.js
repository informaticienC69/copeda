const BASE_URL = 'https://script.google.com/macros/s/AKfycbxtOZfeekVtOXQl094gqNOryD1_KET8liHVHyvuuy05r97IxyY0OpY70_Y_wWkRl5qR1w/exec';

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
          alert('Une erreur est survenue.');
        }
      });
    });
  }

  // --- Consultation Filleul ---
  const consultFiForm = document.getElementById('consultationfi-form');
  if (consultFiForm) {
    consultFiForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
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
        });
    });
  }

  // --- Consultation Parrain ---
  const consultPForm = document.getElementById('consultationP-form');
  if (consultPForm) {
    consultPForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
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
        });
    });
  }
});
