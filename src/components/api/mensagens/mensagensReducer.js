const INITIAL_STATE = {
  dsc_titulo: '',
  dt_envio: '',
  hr_envio: '',
  dsc_subtitulo: '',
  listMensagens: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'TITULO_CHANGED':
      return { ...state, dsc_titulo: action.payload };
    case 'DATA_CHANGED':
      return { ...state, dt_envio: action.payload };
    case 'HORA_CHANGED':
      return { ...state, hr_envio: action.payload };
    case 'SUBTITULO_CHANGED':
      return { ...state, dsc_subtitulo: action.payload };

    case 'MENSAGEM_SEARCHED':
      return {
        ...state,
        listMensagens: action.payload, //.data // dentro do payload ja tem os dados nesse caso
      };
    // case 'MENSAGEM_ADDED': nao faz sentido ter duas para limpar
    case 'MENSAGEM_CLEAR':
      return {
        ...state,
        dsc_titulo: '',
      };
    // INI so para teste
    case 'MENSAGEM_MARK_AS_SEND':
      return {
        ...state,
        listMensagens: action.payload, //.data
      };
    case 'MENSAGEM_MARK_AS_UNSEND':
      return {
        ...state,
        listMensagens: action.payload, //.data
      };
    case 'MENSAGEM_DELETED':
      return {
        ...state,
        listMensagens: action.payload, //.data
      };
    // FIM so para teste

    default:
      return state;
  }
};
