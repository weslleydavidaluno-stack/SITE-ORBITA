// Botão de chamada para ação: leva até o formulário de contato
const btnCta = document.getElementById('btn-cta');
btnCta.addEventListener('click', () => {
  document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('nome').focus({ preventScroll: true });
});

// Consumo da API ViaCEP: preenche endereço e UF a partir do CEP digitado
const campoCep = document.getElementById('cep');
const campoEndereco = document.getElementById('endereco');
const campoUf = document.getElementById('uf');
const statusCep = document.getElementById('cep-status');

campoCep.addEventListener('input', () => {
  // Mantém apenas números e aplica a máscara 00000-000
  let valor = campoCep.value.replace(/\D/g, '').slice(0, 8);
  if (valor.length > 5) {
    valor = `${valor.slice(0, 5)}-${valor.slice(5)}`;
  }
  campoCep.value = valor;
});

campoCep.addEventListener('blur', async () => {
  const cepLimpo = campoCep.value.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    return;
  }

  statusCep.textContent = 'Buscando endereço...';
  statusCep.classList.remove('erro');
  campoEndereco.value = '';
  campoUf.value = '';

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      statusCep.textContent = 'CEP não encontrado. Confira e tente de novo.';
      statusCep.classList.add('erro');
      return;
    }

    campoEndereco.value = `${dados.logradouro || ''}${dados.logradouro ? ', ' : ''}${dados.bairro || ''} — ${dados.localidade}`;
    campoUf.value = dados.uf;
    statusCep.textContent = 'Endereço encontrado!';
  } catch (erro) {
    statusCep.textContent = 'Não conseguimos consultar o CEP agora. Tente novamente.';
    statusCep.classList.add('erro');
  }
});

// Envio do formulário: exibe mensagem de agradecimento sem recarregar a página
const formContato = document.getElementById('form-contato');
const confirmacao = document.getElementById('form-confirmacao');

formContato.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const nome = document.getElementById('nome').value.trim();

  if (!formContato.checkValidity()) {
    confirmacao.textContent = 'Confira os campos obrigatórios antes de enviar.';
    confirmacao.style.color = 'var(--cor-alerta)';
    return;
  }

  confirmacao.style.color = 'var(--cor-selo)';
  confirmacao.textContent = `Obrigado, ${nome.split(' ')[0]}! Recebemos sua mensagem e responderemos em breve.`;
  formContato.reset();
  campoEndereco.value = '';
  campoUf.value = '';
  statusCep.textContent = '';
});

app.post("/enviar", (req, res) => {
  const { nome, email, cep, endereco, uf, mensagem } = req.body;
  console.log("Recebi:", nome, email, mensagem);
  res.send("Mensagem recebida!");
});