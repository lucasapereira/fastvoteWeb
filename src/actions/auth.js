import axios from 'axios';
import { authOptions } from '../components/generic/myAxios';
import { setStorage } from '../components/generic/storage';

export const AUTH_USER = 'auth_user';
export const UNAUTH_USER = 'unauth_user';
export const AUTH_ERROR = 'auth_error';
export const FETCH_MESSAGE = 'fetch_message';
export const EMPRESAS_OK = 'empresas_ok';
export const CPF_ERROR = 'cpf_error';
export const LIMPA_TELA = 'limpa_tela';
export const AUTHENTICATION_PROCESS = 'AUTHENTICATION_PROCESS';
export const SENHA_TROCADA = 'SENHA_TROCADA';
export const SET_SENHA_TROCADA = 'SET_SENHA_TROCADA';
export const ACL_USER = 'ACL_USER';
export const EMAIL_OK = 'EMAIL_OK';

export function setSenhaTrocadaComSucesso(flag) {
  return {
    type: SET_SENHA_TROCADA,
    payload: flag,
  };
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error,
  };
}
export const limpaTela = value => ({
  type: LIMPA_TELA,
  payload: value,
});

export const getEmpresas = field => dispatch => {
  const cpf = field.target.value;

  if (cpf && cpf.length === 11) {
    axios
      .get(`/users/getRepsByCPF?num_cpf_pessoa=${cpf}`, authOptions())
      .then(response => {
        if (response.data.success === true) {
          dispatch({
            type: EMPRESAS_OK,
            payload: response.data.message,
          });
        } else {
          dispatch({
            type: CPF_ERROR,
            payload: response.data.err_dev.message,
          });
        }
      })
      .catch(e => {
        // If request is bad...
        // - Show an error to the user
        dispatch({
          type: CPF_ERROR,
          payload: e.message,
        });
      });
  } else {
    dispatch({
      type: CPF_ERROR,
      payload: 'CPF inválido',
    });
  }
};

export const getEmail = field => dispatch => {
  const cpf = field.target.value;

  if (cpf && cpf.length === 11) {
    axios
      .get(`/users/getEmail?num_cpf_pessoa=${cpf}`, authOptions())
      .then(response => {
        if (response.data.success === true) {
          dispatch({
            type: EMAIL_OK,
            payload: response.data.message,
          });
        } else {
          dispatch({
            type: CPF_ERROR,
            payload: response.data.message,
          });
        }
      })
      .catch(e => {
        // If request is bad...
        // - Show an error to the user
        dispatch({
          type: CPF_ERROR,
          payload: e.message,
        });
      });
  } else {
    dispatch({
      type: CPF_ERROR,
      payload: 'CPF inválido',
    });
  }
};

export const trocarSenha = (senhaAntiga, senhaNova) => async dispatch => {
  dispatch({
    type: AUTHENTICATION_PROCESS,
  });
  try {
    // obtém o token...  var instance = axios.create(authOptions());

    const response = await axios.post(
      '/users/trocasenha',
      {
        senhaAntiga,
        senhaNova,
      },
      authOptions()
    );

    if (response.data.success === true) {
      dispatch({
        type: SENHA_TROCADA,
        payload: response.data.message,
      });
    } else {
      dispatch(authError(response.data.message));
    }
  } catch (e) {
    dispatch(authError(e.message));
  }
};

export const esqueciSenha = (email, recaptcha, cpf) => async dispatch => {
  dispatch({
    type: AUTHENTICATION_PROCESS,
  });
  try {
    // obtém o token...  var instance = axios.create(authOptions());

    const response = await axios.post(
      '/users/esquecisenha',
      {
        dsc_email: email,
        recaptcha,
        num_cpf_pessoa: cpf,
      },
      authOptions()
    );

    if (response.data.success === true) {
      dispatch({
        type: SENHA_TROCADA,
        payload: response.data.message,
      });
    } else {
      dispatch(authError(response.data.message));
    }
  } catch (e) {
    dispatch(authError(e.message));
  }
};

export const signinUser = ({ cpf, senha, empresas }) => async dispatch => {
  dispatch({
    type: AUTHENTICATION_PROCESS,
  });

  try {
    // obtém o token...  var instance = axios.create(authOptions());

    const response = await axios.post(
      '/users/createTokenBySenha',
      {
        num_cpf_pessoa: cpf,
        vlr_senha: senha,
        cod_usuario_representacao: empresas.toString(),
        cod_sistema: '2',
      },
      authOptions()
    );

    if (response.data.success === true) {
      setStorage('token', response.data.token);
      setStorage('nom_completo_pessoa', response.data.message.nom_completo_pessoa);
      setStorage('cod_usuario', response.data.message.cod_usuario);
      setStorage('cod_usuario_representacao', response.data.message.cod_usuario_representacao);
      setStorage('num_cpf_pessoa', response.data.message.num_cpf_pessoa);
      setStorage('num_telefone', response.data.message.num_telefone);
      setStorage('cod_pessoa', response.data.message.cod_pessoa);
      setStorage('cod_pessoa_juridica', response.data.message.cod_pessoa_juridica);

      const menu = await axios.get('/users/getMenus', authOptions());
      const acl = await axios.get('/users/getFuncionalidades', authOptions());

      if (menu.data.success === true && acl.data.success === true) {
        setStorage('menus', JSON.stringify(menu.data.message));
        setStorage('funcionalidades', JSON.stringify(acl.data.message));

        dispatch({
          type: AUTH_USER,
          payload: { menus: menu.data.message, funcionalidades: acl.data.message },
        });
      } else {
        dispatch(authError(response.data.err_dev));
      }
    } else {
      dispatch(authError(response.data.err_dev));
    }
  } catch (e) {
    dispatch(authError(e.message));
  }
};

export function signoutUser() {
  return {
    type: UNAUTH_USER,
  };
}
