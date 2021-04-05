var firebaseConfig = {
  apiKey: "AIzaSyDkkf2BbefLQeEEQXIura0AH30iTsQVF9g",
  authDomain: "programacaomobile-covid.firebaseapp.com",
  projectId: "programacaomobile-covid",
  storageBucket: "programacaomobile-covid.appspot.com",
  messagingSenderId: "1033969692970",
  appId: "1:1033969692970:web:63faf392512815d040ae53",
  measurementId: "G-9S7L7ZLP6J"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var fs = firebase.firestore();

function readCovid(){
  fs.collection('covid').onSnapshot(function(snapshot){
    document.querySelector('#listacovid').innerHTML=''
    snapshot.forEach(function(covidValue){
      document.querySelector('#listacovid').innerHTML+=`
      <div class="row">
        <div class="col" style="margin-top: 7px;">${covidValue.data().nome}</div>
        <div class="col" style="margin-top: 7px;">${covidValue.data().estado}</div>
        <div class="col"><button type="button" class="btn btn-outline-warning" onClick="updateCovid('${covidValue.id}')">Alterar</button></div>
        <div class="col"><button type="button" class="btn btn-outline-danger" onClick="deletePacientes('${covidValue.id}')">Deletar</button></div>
      </div>    
      `
    })
  })
}

readCovid();

document.getElementById('contactForm').addEventListener("submit", (e)=>{
    var nome = document.getElementById("firstName").value
    var data = document.getElementById("data").value
    var telefone = document.getElementById("telefone").value
    var bairro = document.getElementById("bairro").value
    var estado = document.getElementById("state").value
    var cep = document.getElementById("cep").value
    e.preventDefault()
    addCovid(nome, data, telefone, bairro, estado, cep)
    limparForm()
})

function addCovid(nome, data, telefone, bairro, estado, cep){
  console.log(nome, data, telefone, bairro, estado, cep)
  var newCovid = {
    nome: nome,
    data: data,
    telefone: telefone,
    bairro: bairro,
    estado: estado,
    cep: cep
  }
  let db = fs.collection('covid')
  db.add(newCovid).then(()=> {
    /* alert('Paciente adicionado :D') */
    Swal.fire(
      'Paciente adicionado!',
      'Parabéns foi adicionada a fila!',
      'success'
    )
 })
     .catch((error) => {
       alert('error')
 })
 readCovid()
}

function deletePacientes(id){
  /* alert("Paciente deletado"); */
  Swal.fire({
    title: 'Você tem certeza?',
    text: "Você não poderá reverter isso!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim!'
  }).then((result) => {
    if (result.value) {
      fs.collection("covid").doc(id).delete();
      Swal.fire( 
        'Deletado!',
        'Paciente deletado!',
        'success'
      )
    }
  })
}

function updateCovid(id) {
  Swal.fire({
      title: 'Editar Paciente',
      html: `<input type="text" id="firstName" class="swal2-input" placeholder="Nome">
      <input type="text" id="state" class="swal2-input" placeholder="Estado">`,
      confirmButtonText: 'Confirmar',
      focusConfirm: false,
      preConfirm: () => {
        const nome = Swal.getPopup().querySelector('#firstName').value
        const estado = Swal.getPopup().querySelector('#state').value
        if (!nome || !estado) {
          Swal.showValidationMessage(`Please enter nome and uf`)
        }
        return { nome: nome, estado: estado}
      }
    }).then((result) => {
        var newUpdate = {
            nome: result.value.nome,
            estado: result.value.estado
        }
        let db = fs.collection("covid").doc(id)
          db.set(newUpdate).then(()=> {
            Swal.fire(`
                Novo Nome: ${result.value.nome}
                Novo Estado: ${result.value.estado}
        `.trim())
        })
    })
}

function limparForm(){
  document.getElementById("firstName").value = '';
  document.getElementById("lastName").value = '';
  document.getElementById("email").value = '';
  document.getElementById("address").value = '';
  document.getElementById("bairro").value = '';
  document.getElementById("state").value = '';
  document.getElementById("cep").value = '';
  document.getElementById("nomemae").value = '';
  document.getElementById("nomepai").value = '';
  document.getElementById("data").value = '';
  document.getElementById("telefone").value = '';
  selectedRow = null;
}

function meu_callback(conteudo) {
  if (!("erro" in conteudo)) {
    //Atualiza os campos com os valores.
    document.getElementById('address').value=(conteudo.logradouro);
    document.getElementById('state').value=(conteudo.uf);
    document.getElementById('bairro').value=(conteudo.bairro);
  } //end if.
  else {
    //CEP não Encontrado.
    limparForm();
    alert("CEP não encontrado.");
  }
}

function pesquisacep(valor) {

  //Nova variável "cep" somente com dígitos.
  var cep = valor.replace(/\D/g, '');

  //Verifica se campo cep possui valor informado.
  if (cep != "") {

      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if(validacep.test(cep)) {

          console.log(cep);

          //Preenche os campos com "..." enquanto consulta webservice.
          document.getElementById('address').value="...";
          document.getElementById('state').value="...";
          document.getElementById('bairro').value="...";
          
          //Cria um elemento javascript.
          var script = document.createElement('script');

          //Sincroniza com o callback.
          script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

          //Insere script no documento e carrega o conteúdo.
          document.body.appendChild(script);

      } //end if.
      else {
          //cep é inválido.
          limparForm();
          alert("Formato de CEP inválido.");
      }
  } //end if.
  else {
      //cep sem valor, limpa formulário.
      limparForm();
  }
};