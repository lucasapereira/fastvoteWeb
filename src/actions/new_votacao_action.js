import axios from 'axios';
import { authOptions } from '../components/generic/myAxios';

export const FETCH_EMPRESAS = 'FETCH_EMPRESAS';
export const ERROR_VOTACAO = 'ERROR_VOTACAO';
export const SET_COD_PESSOA_JURIDICA = 'SET_COD_PESSOA_JURIDICA';
export const CREATE = 'create';

export function error(error) {
  return {
    type: ERROR_VOTACAO,
    payload: error,
  };
}

export const setCodPessoaJuridica = value => ({
  type: SET_COD_PESSOA_JURIDICA,
  payload: value,
});

export const fetchEmpresas = value => async function (dispatch) {
  try {
    const response = await axios.get(
        `/empresas/getEmpresas?nom_pessoa_juridica=${value}`,
        await authOptions(),
      );

    if (response.data.success) {
      dispatch({
        type: FETCH_EMPRESAS,
        payload: response.data.message,
      });
    } else {
      dispatch(error(response.data.message));
    }
  } catch (e) {
    dispatch(error(e.message));
  }
};

export const createVotacao = (values, callback) => async function (dispatch) {
  try {
    const request = await axios.post('/votacao/createVotacao', values, authOptions());

    await callback();

    dispatch({
      type: CREATE,
      payload: request,
    });
  } catch (e) {
    console.log(e);
  }
};
