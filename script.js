// URL de ton Web App Google Apps Script
const BASE_URL = 'https://script.google.com/macros/s/AKfycbylnrvabRRaeTRgWMDX6yygMPn8yii_V61odMYkEJ-6LwVQoNIDHZ55U-nKqVjeFx6k5Q/exec';

document.addEventListener('DOMContentLoaded', function() {

    // Dynamiser le champ "Filière" selon le type choisi
  const typeSelect = document.getElementById('type');
  const filiereSelect = document.getElementById('filiere');

 if (typeSelect && filiereSelect) {
  typeSelect.addEventListener('change', function () {
    const selectedType = this.value;
    filiereSelect.innerHTML = '<option value="">-- Sélectionnez une filière --</option>'; // Réinitialise

    if (selectedType === 'Filleul') {
      filiereSelect.innerHTML += '<option value="SRT">SRT</option>';
      filiereSelect.innerHTML += '<option value="GLSI">GLSI</option>';
    } else if (selectedType === 'Parrain') {
      filiereSelect.innerHTML += '<option value="Telecom">Telecom</option>';
      filiereSelect.innerHTML += '<option value="Informatique">Informatique</option>';
    }
  });

  // Force le déclenchement au chargement initial
  typeSelect.dispatchEvent(new Event('change'));
}
  // --- Enregistrement ---
  if (document.getElementById('enregistrement-form')) {
    document.getElementById('enregistrement-form').addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const imageFile = formData.get('image');
      const reader = new FileReader();

      reader.onloadend = function() {
        formData.append('imageBase64', reader.result.split(',')[1]);
        formData.append('mimeType', imageFile.type);
        formData.append('filename', imageFile.name);

        fetch(BASE_URL, { // POST vers BASE_URL
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Enregistrement effectué avec succès!');
          } else {
            alert('Une erreur est survenue.');
          }
        });
      };

      reader.readAsDataURL(imageFile);
    });
  }

  // --- Consultation Filleul (affiche le parrain) ---
  if (document.getElementById('consultationfi-form')) {
    document.getElementById('consultationfi-form').addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      fetch(`${BASE_URL}?email=${encodeURIComponent(email)}&role=Filleul`)
        .then(response => response.json())
        .then(data => {
          if (data.nom) {
            document.getElementById('parrain-info').style.display = 'block';
            document.getElementById('parrain-nom').textContent = `Nom: ${data.nom} ${data.prenom}`;
            document.getElementById('parrain-whatsapp').textContent = `WhatsApp: ${data.whatsapp}`;
            // <- on utilise désormais photoId
            document.getElementById('parrain-photo').src = 
              `${BASE_URL}?photoId=${data.photoId}`;
          } else {
            alert('Aucun parrain trouvé pour cet email.');
          }
        });
    });
  }

  // --- Consultation Parrain (affiche les filleuls) ---
  if (document.getElementById('consultationP-form')) {
    document.getElementById('consultationP-form').addEventListener('submit', function(e) {
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
                <!-- idem : on pointe vers ?photoId= -->
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

