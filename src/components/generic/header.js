import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import { getStorage } from './storage';

import logoImg from '../../assets/imgs/logo.png';

class Header extends Component {
  montaMenuHierarquizado = (arrMenu, codMenuPai = null) => {
    const cont = arrMenu.length;
    const pagesMenu = [];

    for (let i = 0; i < cont; i++) {
      if (arrMenu[i].cod_menu_pai === codMenuPai) {
        const arrSubMenu = {
          dsc_title_menu: arrMenu[i].dsc_title_menu,
          dsc_label_menu: arrMenu[i].dsc_label_menu,
          cod_menu: arrMenu[i].cod_menu,
          key: arrMenu[i].cod_menu,
          dsc_url: `/frontend${arrMenu[i].dsc_url}`,
        };

        for (let j = 0; j < cont; j++) {
          if (arrMenu[j].cod_menu_pai === arrMenu[i].cod_menu) {
            arrSubMenu.pages = this.montaMenuHierarquizado(arrMenu, arrMenu[j].cod_menu_pai);
          }
        }
        pagesMenu.push(arrSubMenu);
      }
    }
    return pagesMenu;
  };

  renderMenuItem = menu => (
    <LinkContainer to={menu.dsc_url} key={menu.dsc_label_menu}>
      <MenuItem key={menu.cod_menu}>{menu.dsc_label_menu}</MenuItem>
    </LinkContainer>
  );

  renderNavigationMenus = () => {
    if (!this.props.authenticated) {
      return;
    }

    const menus = JSON.parse(getStorage('menus'));
    const menuHierarquizado = this.montaMenuHierarquizado(menus);

    return _.map(menuHierarquizado, menu => {
      if (_.isObject(menu.pages)) {
        return (
          <NavDropdown title={menu.dsc_title_menu} id={menu.dsc_url} key={menu.cod_menu}>
            {menu.pages.map(this.renderMenuItem)}
            {this.renderMenuItem(menu)}
          </NavDropdown>
        );
      }
      return (
        <LinkContainer to={menu.dsc_url} key={Math.random()}>
          <NavItem key={menu.cod_menu}>{menu.dsc_title_menu}</NavItem>
        </LinkContainer>
      );
    });
  };
  renderLinks() {
    if (this.props.authenticated) {
      // show a link to sign out
      return (
        <LinkContainer to="/frontend/auth/signout">
          <NavItem eventKey={1}>Sair</NavItem>
        </LinkContainer>
      );
    }
    // show a link to sign in or sign up
    return (
      <LinkContainer to="/frontend/auth/signin">
        <NavItem>Entrar</NavItem>
      </LinkContainer>
    );
  }

  renderTrocarSenha = () => {
    if (this.props.authenticated) {
      // show a link to sign out
      return (
        <LinkContainer to="/frontend/auth/trocarsenha">
          <NavItem eventKey={2}>Trocar Senha</NavItem>
        </LinkContainer>
      );
    }
  };

  renderNomeUsuario = () => {
    if (this.props.authenticated) {
      const nomCompletoPessoa = getStorage('nom_completo_pessoa');

      if (nomCompletoPessoa) {
        return (
          <NavDropdown title={nomCompletoPessoa} id={nomCompletoPessoa}>
            {this.renderTrocarSenha()}
            {this.renderLinks()}
          </NavDropdown>
        );
      }
    }
  };

  render() {
    return (
      <Navbar collapseOnSelect className="navbar navbar-inverse">
        <Navbar.Header>
          <Navbar.Brand>
            <div>
              <div style={{ display: 'inline' }}>
                <a href="https://www.fastvote.com.br/">
                  <img alt={'FastVote'} src={logoImg} />
                </a>
              </div>
              <div
                style={{
                  display: 'inline',
                  position: 'absolute',
                  bottom: 0,
                }}>
                &nbsp;{process.env.REACT_APP_VERSION}
              </div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {this.renderNavigationMenus()}
            {this.renderNomeUsuario()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps)(Header);
