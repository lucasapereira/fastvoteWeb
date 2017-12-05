const validate = values => {
  const errors = {};

  console.log(values);
  console.log();

  if (!values.nomcompletopessoa) {
    errors.nomcompletopessoa = 'Obrigatório';
  }
  if (!values.numcpfpessoa) {
    errors.numcpfpessoa = 'Obrigatório';
  }
  if (!values.dscemail) {
    errors.dscemail = 'Obrigatório';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.dscemail)) {
    errors.dscemail = 'E-mail inválido';
  }
  if (!values.numtelefone) {
    errors.numtelefone = 'Obrigatório';
  }

  if (!values.numcep) {
    errors.numcep = 'Obrigatório';
  }
  if (!values.dscuf) {
    errors.dscuf = 'Obrigatório';
  }
  if (!values.numtelefone) {
    errors.numtelefone = 'Obrigatório';
  }
  if (!values.dsclocalidade) {
    errors.dsclocalidade = 'Obrigatório';
  }
  if (!values.dscbairro) {
    errors.dscbairro = 'Obrigatório';
  }
  if (!values.dsclogradouro) {
    errors.dsclogradouro = 'Obrigatório';
  }
  if (!values.dscnumero) {
    errors.dscnumero = 'Obrigatório';
  }
  if (!values.dsclatitude) {
    errors.dsclatitude = 'Obrigatório';
  }
  if (!values.dsclongitude) {
    errors.dsclongitude = 'Obrigatório';
  }
  if (!values.vlrcnpj) {
    errors.vlrcnpj = 'Obrigatório';
  }
  if (!values.nompessoajuridica) {
    errors.nompessoajuridica = 'Obrigatório';
  }
  if (!values.sglpessoajuridica) {
    errors.sglpessoajuridica = 'Obrigatório';
  }

  return errors;
};

export default validate;
