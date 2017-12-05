export const required = value => (value === null ? 'Obrigatório' : undefined);
export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'E-mail inválido' : undefined;

export const cpf = sCpf => {
  console.log('por aqui');
  if (sCpf === undefined || sCpf === null) {
    return undefined;
  }
  var strCPF = sCpf.replace(/[.-]/g, '');

  let Soma;
  let Resto;
  Soma = 0;
  if (strCPF === '00000000000') return 'Cpf inválido';

  for (let i = 1; i <= 9; i++) Soma += parseInt(strCPF.substring(i - 1, i), 10) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) Resto = 0;
  if (Resto !== parseInt(strCPF.substring(9, 10), 10)) return 'Cpf inválido';

  Soma = 0;
  for (let i = 1; i <= 10; i++) Soma += parseInt(strCPF.substring(i - 1, i), 10) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) Resto = 0;
  if (Resto !== parseInt(strCPF.substring(10, 11), 10)) return 'Cpf inválido';
  return undefined;
};
