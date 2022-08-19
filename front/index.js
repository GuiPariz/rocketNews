// Adicionando um event listerner de ready,
// basicamente ele vai esperar toda pagina carregar
// para executar o script init

document.addEventListener('DOMContentLoaded', init);
function init() {
  const button = document.querySelector('#button');
  button.addEventListener('click', enviarEmail);
}

async function enviarEmail(event) {
  try {
    event.preventDefault();
    const email = document.getElementById('email').value

    const API_PATH = "https://southamerica-east1-rocketnews-d32c9.cloudfunctions.net/helloWorld"
    const response = await fetch(API_PATH, {
      method: 'POST',
      body: JSON.stringify({ email })
    })

    const data = await response.json();
    if (response.status !== 200) throw new Error(data)
    
    alert('Email cadastrado com sucesso')
  } catch (err) {
    alert(err.message)
  }
}
