/// <reference types="cypress" />

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order' }).as('createOrder');
    
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
      win.document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
  });

  it('должна отображать список ингредиентов', () => {
    cy.contains('Краторная булка N-200i').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    cy.contains('Соус традиционный галактический').should('exist');
  });

  it('должна добавлять ингредиент в конструктор', () => {
    cy.contains('Краторная булка N-200i')
      .parent()
      .contains('Добавить')
      .click();
    
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .contains('Добавить')
      .click();
    
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('должна открывать страницу ингредиента и возвращаться назад', () => {
    cy.contains('Краторная булка N-200i').click();
    
    cy.url().should('include', '/ingredients/');
    cy.contains('Краторная булка N-200i').should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');
    
    cy.go('back');
    cy.url().should('eq', 'http://localhost:4000/');
  });

  it('должна создавать заказ после авторизации', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
      win.document.cookie = 'accessToken=Bearer test-access-token; path=/';
    });
    
    cy.contains('Краторная булка N-200i')
      .parent()
      .contains('Добавить')
      .click();
    
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .contains('Добавить')
      .click();
    
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');
    
    cy.contains('103624').should('be.visible');
    
    cy.get('[data-cy="modal-close"]').click();
    
    cy.contains('103624').should('not.exist');
  });
});