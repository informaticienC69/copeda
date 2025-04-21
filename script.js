// URL de ton Web App Google Apps Script
const BASE_URL = 'https://script.google.com/macros/s/AKfycbzPjMd3Ao2cNhoNtu5U2NqhYH0qpI1AoVVZjfIoLlF8GPfs_MjD6QDhmh323ywhBKcy8w/exec';

document.addEventListener('DOMContentLoaded', () => {
  const typeSelect = document.getElementById('type');
  const filiereSelect = document.getElementById('filiere');

  const filieres = {
    Parrain: ["Telecom", "Informatique"],
    Filleul: ["SRT", "GLSI"]
  };

  // Fonction pour mettre à jour les options de filière
  function updateFilieres() {
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

  updateFilieres();
  typeSelect.addEventListener('change', updateFilieres);

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

        fetch(BASE_URL, {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Enregistrement effectué avec succès!');
            
            // Vider les champs du formulaire après l'enregistrement
            document.getElementById('enregistrement-form').reset();
            updateFilieres(); // Réinitialiser les options de filière
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
          console.log("Réponse consultation Filleul :", data); // AJOUTE CETTE LIGNE
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

  // --- Consultation Parrain (affiche les filleuls) ---
  if (document.getElementById('consultationP-form')) {
    document.getElementById('consultationP-form').addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      fetch(`${BASE_URL}?email=${encodeURIComponent(email)}&role=Parrain`)
        .then(response => response.json())
        .then(data => {
          console.log("Réponse consultation Parrain :", data); // AJOUTE CETTE LIGNE
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
}); // ← On ferme ici le document.addEventListener
