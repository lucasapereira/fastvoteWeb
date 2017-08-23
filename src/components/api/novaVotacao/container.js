import React, { Component } from 'react';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';









import { TextField } from 'redux-form-material-ui';

import Loader from 'halogen/PulseLoader';
import AutoComplete from 'material-ui/AutoComplete';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';


import { compose } from 'react-apollo';
import { 

allUsuariosQuePodemVotar, allUsuariosQuePodemVotarOptions

} from '../../../graphql/votacao_new';


const style = {
  marginRight: 20,
  marginLeft: 20,
};

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const validate = (values) => {
  const errors = {};

  const v = new Validator();
  const results = v.validate(values, postSchemas);

  results.errors.map((error) => {
    errors[error.argument] = error.name;
    return null;
  });

  return errors;
};

const renderMembers = ({ fields, meta: { error, submitFailed } }) =>
  (<div>
    <FloatingActionButton mini onClick={() => fields.push({})}>
      <ContentAdd />
    </FloatingActionButton>
    {submitFailed &&
      error &&
      <span>
        {error}
      </span>}
    <div>
      {fields.map((resposta, index) =>
        (<div key={`Resposta ${index + 3}`}>
          <Field
            name={`field${index + 3}`}
            component={TextField}
            hintText={`Resposta ${index + 3}`}
            key={`Resposta ${index + 3}`}
          />
          <FloatingActionButton
            backgroundColor="red"
            style={style}
            mini
            onClick={() => fields.remove(index)}
            key={`Respos ${index}`}
          >
            <i
              className="material-icons"
              style={{
                color: 'white',
              }}
            >
              delete_forever
            </i>
          </FloatingActionButton>
        </div>),
      )}
    </div>
  </div>);

  const retornaSelecaoUsuarios = (codpessoajuridica) => {

    console.log(codpessoajuridica);
    if(codpessoajuridica){

     

/*
      var usuariosPodemVotar = this.state.allUsuariosQuePodemVotar.map(function(row) {
        var arrUsuarios = [];

        arrUsuarios.push(
          <ListItem
                  leftCheckbox={<Checkbox value={row.codUsuario} />}
                  primaryText={row.codUsuario + ' - ' + row.nomCompletoPessoa}
                  secondaryText={'PESO: ' + row.vlrPeso + ' - Dados Adicionais: ' + 
                          row.dscDadosAdicionais + ' - ' + row.dscDadosAdicionais}
              />);
        
        return arrUsuarios;
      });
      
      return (
        <div>
          {usuariosPodemVotar}
        </div>
      );
*/

/*    console.log('BBB ' + this.state.empresaSelecionada);

    // Fazer loop com todos os dados adicionais da empresa

          return ( 
            <Checkbox
      label="Simple - retornaSelecaoUsuarios"
      
    />);
*/
    }

  }

class PostsNew extends Component {

  state = {
    codpessoajuridica : null,

    arrDadosAdicionais : [
      {
        codDadosAdicionais: 1,
        dscDadosAdicionais: 'Bloco AA'
      },
      {
        codDadosAdicionais: 2,
        dscDadosAdicionais: 'Bloco BB'
      }],

    /*
    allUsuariosQuePodemVotar : [
      {
        codUsuario: 1,
        nomCompletoPessoa: "Lucas Araujo Pereira",
        vlrPeso: 1,
        codDadosAdicionais: 1,
        dscDadosAdicionais: "Bloco A"
      },
      {
        codUsuario: 1,
        nomCompletoPessoa: "Lucas Araujo Pereira",
        vlrPeso: 1,
        codDadosAdicionais: 2,
        dscDadosAdicionais: "Bloco B\n"
      }
    ]*/
  }




  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          {this.props.errorMessage}
        </div>
      );
    }
  }


  onSubmit = (values) => {
    console.log('PROPS', this.props);

    values.cod_pessoa_juridica = this.props.cod_pessoa_juridica;

    this.props.createVotacao(values, () => {
      this.props.history.push('/votacao/list');
    });
  };

  

  

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div>
          <Field name="dsc_votacao" component={TextField} hintText="Nome da Votação" />
        </div>
        <div>
          <Field name="dsc_pergunta" component={TextField} hintText="Pergunta" />
        </div>
        {this.renderResposta(-1)}
        {this.renderResposta(0)}
        <FieldArray name="members" component={renderMembers} />
        {this.renderAutoComplete()}

        <div>
          {this.renderAlert()}
        </div>

        <div>
          <RaisedButton type="submit" label="Criar" disabled={pristine || submitting} primary />
          <RaisedButton
            type="button"
            label="Limpar"
            disabled={pristine || submitting}
            onClick={reset}
          />
          <Link to="/votacao/list">
            <RaisedButton type="button" disabled={submitting} label="Cancel" secondary />
          </Link>
        </div>

        <div style={styles.root}>
          <List>
            <Subheader>Dados Adicionais</Subheader>
            {this.retornaFiltroDadosAdicionais()}
          </List>

          <Divider />
          
          <List>
            <Subheader>Usuários que Podem Votar</Subheader>
            {retornaSelecaoUsuarios(cod_pessoa_juridica)}

            <retornaSelecaoUsuarios codPessoaJuridica = {state.codpessoajuridica} />
          </List>
        </div>

      </form>
    );
  }
}

const mapStateToProps = state => ({
  dataSource: state.votacao.dataSource,
  cod_pessoa_juridica: state.votacao.cod_pessoa_juridica,
  loading: state.votacao.loading,
  errorMessage: state.votacao.errorMessage,
});

const selector = formValueSelector('PostsNew'); // <-- same as form name
PostsNew = connect(state => ({
  members: selector(state, 'members'),
}))(PostsNew);

//export default compose(//ResultDadosAdicionais,
//    ResultAllUsuariosQuePodemVotar)(PostsNew);


export reduxForm(
  {
    form: 'PostsNew',
    enableReinitialize: true,
    validate,
    members: [
      {
        name: 'django',
      },
    ],
  },
  validate,
)(
  connect(mapStateToProps, {
    createVotacao,
    setCodPessoaJuridica,
    fetchEmpresas
  })(PostsNew),
);
const ResultAllUsuariosQuePodemVotar = graphql(allUsuariosQuePodemVotar, allUsuariosQuePodemVotarOptions);

