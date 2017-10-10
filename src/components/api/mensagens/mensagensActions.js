// import axios from 'axios';
// const URL = 'http://localhost:3003/api/todos';

/*
export function changeValue(e) {
  console.log('changeValue');
  return {
    type: 'VALUE_CHANGED',
    payload: e.target.value,
  };
}
*/

import { client } from '../../../reducers';

export const changeTitulo = event => ({
  type: 'TITULO_CHANGED',
  payload: event.target.value,
});

export const changeData = (event, date) => ({
  type: 'DATA_CHANGED',
  // payload: event.target.value,
  payload: date,
});

export const changeHora = (event, date) => ({
  type: 'HORA_CHANGED',
  //payload: event.target.value,
  payload: date,
});

export const changeSubtitulo = event => ({
  type: 'SUBTITULO_CHANGED',
  payload: event.target.value,
});

/*
pegar o estado dentro da action creator

export const search = () => {
  return (dispatch, getState) => {
    const description = getState().todo.description
    const search = description ? `&description__regex=/${description}/` : ''
    const request = axios.get(`${URL}?sort=-createdAt${search}`)
      .then(resp => dispatch({type: 'TODO_SEARCHED', payload: resp.data}))
  }
}
*/

export const search = () => {
  // vai precisar pegar o estado dentro da action creator - pra isso passa o getstate para pesquisar estado
  return (dispatch, getState) => {
    const dsc_titulo = getState().mensagens.dsc_titulo;

    console.log('TESTE dentro do action ', getState().mensagens.listMensagens);
    // console.log('TESTE dentro do action 2 ', this.props.rows);

    /*
    // Verifica se tem parametro setado e monta url de pesquisa
    const search = description ? `&description__regex=/${description}/` : ''
    // chama axios com a url de pesquisa ou nao
    const request = axios.get(`${URL}?sort=-createdAt${search}`)
      .then(resp => dispatch({type: 'TODO_SEARCHED', payload: resp.data}))
    */

    if (dsc_titulo) {
      console.log(`Searchouu MENSAGEM_SEARCHED (COM TITULO ${dsc_titulo} ) - mensagensActions`);
    } else {
      console.log(`Searchouu MENSAGEM_SEARCHED (SEM TITULO) - mensagensActions`);
    }

    resp =>
      dispatch({
        type: 'MENSAGEM_SEARCHED',
        payload: [
          {
            codMensagem: 1,
            codPessoaJuridica: 1,
            datEnvio: '2017-11-11T18:22:00',
            flgEnviaapppush: false,
            flgEnviado: true,
            flgEnviaemail: false,
            flgEnviawebpush: true,
            flgErroEnvio: false,
            mensagem:
              'Stet aperiri epicurei ex duo, te tritani sapientem eos. Verear dignissim expetendis at est. Te ferri adipisci nam, dico reprehendunt in ius.',
            subtitulo: 'BLAAA FAKE NO REDUCER subtitulo mensagem 1',
            titulo: 'Teste Msg 1',
          },
        ],
        // payload: resp.data
      });
  };
};

export const addMensagem = description => {
  console.log('Chamou addMensagem - MENSAGEM_ADDED - mensagensActions', description);
  // middleware multi permite retornar um array de actions
  // middleware thunk garante que o search sera chamando quando o request retornar de forma bem sucedidfa (Promisser)

  // thunk retonra nao mais uma action, mas sim um metodo e esse metodo recebe como parametro o dispatch
  // (é quem dispara as ações)
  /*
  return dispatch => {
    const request = axios
      .post(URL, { description })
      // primeiro then faz a inclusao

      //.then(resp =>
      //  dispatch({
      //    type: 'MENSAGEM_ADDED',
      //    // payload: request,
      //    payload: [],
      //  })
      //)
      // Ao inves de lancar a action do tipo MENSAGEM_ADDED, somente chama o clear
      .then(resp => dispatch(clear()));
      // somente quando a resposta vier vai fazer o search
      .then(resp => dispatch(search()));
  };
  */
  return [
    /*{
      type: 'MENSAGEM_ADDED',
      // payload: request,
      payload: [],
    }, */
    clear(),
    search(),
  ];
  /*
  acontecem duas coisas
  - limpa campo do formulario (No reducerr seta vazio nos campos)
  - atualiza lista
  */
};

/*
export const createVotacao = (values, callback) => async (dispatch) => {
  try {
    const request = await axios.post('/votacao/createVotacao', values, authOptions());

    await callback();

    dispatch({
      type: CREATE,
      payload: request,
    });
  } catch (e) {
    dispatch(error(e.message));
  }
};
*/

export const markAsSend = mensagem => {
  console.log('Chamou markAsSend - MENSAGEM_MARK_AS_SEND - mensagensActions', mensagem);

  /*
  return dispatch => {
    axios.put(`${URL}/${mensagem.cod_mensagem}`, { ...mensagem, flgEnviado: true })
    .then(resp => dispatch({type: 'MENSAGEM_MARK_AS_SEND', payload: resp.data}})) // retorna o proprio objeto atualizado
    .then(resp => dispatch(search()));
  };
  */
  return [
    {
      type: 'MENSAGEM_MARK_AS_SEND',
      // payload: request,
      payload: [{ ...mensagem, flgEnviado: true }],
    },
    search(),
  ];
};

export const markAsUnsend = mensagem => {
  console.log('Chamou markAsUnsend - MENSAGEM_MARK_AS_UNSEND - mensagensActions', mensagem);

  /*
  return dispatch => {
    axios.put(`${URL}/${mensagem.cod_mensagem}`, { ...mensagem, flgEnviado: false }).then(resp => dispatch(search()));
  };
  */
  return [
    {
      type: 'MENSAGEM_MARK_AS_UNSEND',
      // payload: request,
      payload: [{ ...mensagem, flgEnviado: false }],
    },
    search(),
  ];
};

export const remove = mensagem => {
  console.log('Chamou REMOVE - MENSAGEM_DELETED - mensagensActions', mensagem);
  //return dispatch => {
  //  axios.delete(`${URL}/${mensagem.cod_mensagem}`).then(resp => dispatch(search()))
  //}

  return [
    {
      type: 'MENSAGEM_DELETED',
      // payload: request,
      payload: [{ ...mensagem, flgEnviado: false }],
    },
    search(),
  ];
};

// Refatorar usando constantes para setar os types e usar no mensagens Action e mensagens Reducer
export const clear = () => {
  console.log('LImpou a bagaça - MENSAGEM_CLEAR - mensagensActions');
  return [{ type: 'MENSAGEM_CLEAR' }, search()];
};
