//**********Analise e Desenvolvimento de Sistemas */
//**********Wesley Araujo */
//**********Programação Mobile */
//**********Firebase */
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
    document.querySelector('#listacovid').innerHTML='';
    snapshot.forEach(function(covidValue){
      document.querySelector('#listacovid').innerHTML+=`
        <table class="table table-striped">
          <tbody>
            <tr>
              <td class="col col-lg-2">Nome: ${covidValue.data().nome}</td>
            </tr>
            <tr>
              <td class="col col-lg-2">Bairro: ${covidValue.data().bairro}</td>
            </tr>
            <tr>
              <td class="col col-lg-2">Cep: ${covidValue.data().cep}</td>
            </tr>
            <tr>
              <td><button type="button" class="btn btn-outline-warning" onClick="updateCovid('${covidValue.id}')">Alterar</button>
              <button type="button" class="btn btn-outline-danger" onClick="deletePacientes('${covidValue.id}')" style="margin-bottom: 0px;margin-left: 15px;">Deletar</button></td> 
            </tr>
          </tbody>
        </table>
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
    insert(nome, data, telefone, bairro, estado, cep)
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
             <input type="text" id="bairro" class="swal2-input" placeholder="Bairro">
             <input type="text" id="cep" class="swal2-input" placeholder="Cep">`,
      confirmButtonText: 'Confirmar',
      focusConfirm: false,
      preConfirm: () => {
        const nome = Swal.getPopup().querySelector('#firstName').value
        const bairro = Swal.getPopup().querySelector('#bairro').value
        const cep = Swal.getPopup().querySelector('#cep').value
        if (!nome) {
          Swal.showValidationMessage(`Please enter nome`)
        }
        return { nome: nome, bairro: bairro, cep: cep}
      }
    }).then((result) => {
        var newUpdate = {
            nome: result.value.nome,
            bairro: result.value.bairro,
            cep: result.value.cep
        }
        let db = fs.collection("covid").doc(id)
          db.set(newUpdate).then(()=> {
            Swal.fire(`
                Novo Nome: ${result.value.nome}
                Novo Bairro: ${result.value.bairro}
                Novo Cep: ${result.value.cep}
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

//**********Api ViaCep */
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

//**********Web SQL Database - Client-Side */
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

function insert(nome, data, telefone, bairro, estado, cep){
  db.transaction(function (tx) {
     tx.executeSql('CREATE TABLE IF NOT EXISTS COVID (nome, data, telefone, bairro, estado, cep)');
     tx.executeSql('INSERT INTO COVID (nome, data, telefone, bairro, estado, cep) VALUES (?,?,?,?,?,?)', 
     [nome, data, telefone, bairro, estado, cep]);
  });
}

function selectQueue() {
  db.transaction(function(tx) {
      tx.executeSql("SELECT NOME,TELEFONE FROM covid", [], function(sqlTransaction, sqlResultSet) {
          var rows = sqlResultSet.rows;
          var len = rows.length;
          for (var i = 0; i < len; i++) {
              var covid = rows[i];
              console.log(i + " - Nome: " + covid.nome + ", Telefone : " + covid.telefone);
              var js = "Nome: " + covid.nome + ", Telefone: " + covid.telefone;
              Swal.fire({
                title: 'Web SQL Database',
                text: js,
                width: 600,
                padding: '3em',
                background: '#fff url("https://firebasestorage.googleapis.com/v0/b/programacaomobile-covid.appspot.com/o/trees.png?alt=media&token=bd9c687c-0ae3-4268-ace9-20d36c34d36c")',
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("https://firebasestorage.googleapis.com/v0/b/programacaomobile-covid.appspot.com/o/nyan-cat.gif?alt=media&token=d80f2fbf-72b0-43bf-9804-36b161ca5924")
                  left top
                  no-repeat
                `
              })
          }
          console.log('Done!!!');
      });
  });
}
