const BASE_URL = 'https://script.google.com/macros/s/AKfycbzBuCnBTsvssyR-plJTvUTP-idIA9wl18Epau2e221y8uYaBpDjig58kYpLVEcdDxEG/exec';

document.addEventListener('DOMContentLoaded', () => {
  const typeSelect = document.getElementById('type');
  const filiereSelect = document.getElementById('filiere');

  const filieres = {
    Parrain: ["Telecom", "Informatique"],
    Filleul: ["SRT", "GLSI"]
  };

  // Fonction pour mettre à jour les options de filière
  function updateFilieres() {
    if (!typeSelect || !filiereSelect) return; // Sécurité si éléments absents

    const selectedType = typeSelect.value;
    console.log("Type sélectionné :", selectedType);
    const options = filieres[selectedType] || [];

    filiereSelect.innerHTML = "";
    options.forEach(f => {
      const option = document.createElement('option');
      option.value = f;
      option.textContent = f;
      filiereSelect.appendChild(option);
    });
  }

  // --- Enregistrement ---
  const form = document.getElementById('enregistrement-form');
  if (form && typeSelect && filiereSelect) {
    updateFilieres();
    typeSelect.addEventListener('change', updateFilieres);

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const imageFile = formData.get('image');
      const reader = new FileReader();

      reader.onloadend = function() {
        formData.append('imageBase64', reader.result.split(',')[1]);
        formData.append('mimeType', imageFile.type);
        formData.append('filename', imageFile.name);

        fetch(BASE_URL, {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Enregistrement effectué avec succès!');
            form.reset();
            updateFilieres(); // Recharger les filières après reset
          } else {
            alert('Une erreur est survenue.');
          }
        });
      };

      reader.readAsDataURL(imageFile);
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
          console.log("Réponse consultation Filleul :", data);
          if (data.nom) {
            document.getElementById('parrain-info').style.display = 'block';
            document.getElementById('parrain-nom').textContent = `Nom: ${data.nom} ${data.prenom}`;
            document.getElementById('parrain-whatsapp').textContent = `WhatsApp: ${data.whatsapp}`;
            document.getElementById('parrain-photo').src = `${BASE_URL}?photoId=${data.photoId}`;
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
          console.log("Réponse consultation Parrain :", data);
          if (data.filleuls && data.filleuls.length > 0) {
            const filleulsList = document.getElementById('filleuls-list');
            filleulsList.innerHTML = '';
            data.filleuls.forEach(filleul => {
              const div = document.createElement('div');
              div.innerHTML = `
                <p>${filleul.nom} ${filleul.prenom}</p>
                <p>WhatsApp: ${filleul.whatsapp}</p>
                <img src="${BASE_URL}?photoId=${filleul.photoId}" alt="Photo du Filleul">
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
