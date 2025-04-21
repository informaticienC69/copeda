document.addEventListener('DOMContentLoaded', function() {
  // Enregistrement
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

        fetch('https://script.google.com/macros/s/AKfycbwsBv6sbBYO1soK_P_U4uguAjOe_L1ChyQCugDXVTyrr8pTqUBMfNVN_3zXN9OozBZ5pw/exec', {
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

  // Consultation Filleul
  if (document.getElementById('consultationfi-form')) {
    document.getElementById('consultationfi-form').addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      fetch(`https://script.google.com/macros/s/AKfycbwsBv6sbBYO1soK_P_U4uguAjOe_L1ChyQCugDXVTyrr8pTqUBMfNVN_3zXN9OozBZ5pw/exec?email=${email}&role=Filleul`)
        .then(response => response.json())
        .then(data => {
          if (data.nom) {
            document.getElementById('parrain-info').style.display = 'block';
            document.getElementById('parrain-nom').textContent = `Nom: ${data.nom} ${data.prenom}`;
            document.getElementById('parrain-whatsapp').textContent = `WhatsApp: ${data.whatsapp}`;
            document.getElementById('parrain-photo').src = data.photo;
          } else {
            alert('Aucun parrain trouvé pour cet email.');
          }
        });
    });
  }

  // Consultation Parrain
  if (document.getElementById('consultationP-form')) {
    document.getElementById('consultationP-form').addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      fetch(`https://script.google.com/macros/s/AKfycbwsBv6sbBYO1soK_P_U4uguAjOe_L1ChyQCugDXVTyrr8pTqUBMfNVN_3zXN9OozBZ5pw/exec?email=${email}&role=Parrain`)
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
                <img src="${filleul.photo}" alt="Photo du Filleul">
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

