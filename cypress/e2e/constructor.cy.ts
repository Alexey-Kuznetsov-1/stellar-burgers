describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Перехват запроса ингредиентов
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients' }).as('getIngredients');
    // Перехват запроса авторизации пользователя
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user' }).as('getUser');
    // Перехват запроса создания заказа
    cy.intercept('POST', '**/api/orders', { fixture: 'order' }).as('createOrder');
    
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должна отображать список ингредиентов', () => {
    cy.contains('Краторная булка N-200i').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    cy.contains('Соус традиционный галактический').should('exist');
  });

  it('должна добавлять ингредиент в конструктор', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i')
      .parent()
      .contains('Добавить')
      .click();
    
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    
    // Добавляем начинку
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .contains('Добавить')
      .click();
    
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('должна открывать модальное окно ингредиента и закрывать его', () => {
    // Открываем модалку
    cy.contains('Краторная булка N-200i').click();
    
    // Модалка может быть открыта на отдельной странице, проверяем URL
    cy.url().should('include', '/ingredients/');
    
    // Если модалка рендерится как отдельная страница, ищем контент
    cy.contains('Детали ингредиента').should('be.visible');
    
    // Возвращаемся назад
    cy.go('back');
    cy.url().should('eq', 'http://localhost:4000/');
  });

  it('должна создавать заказ после авторизации', () => {
    // Устанавливаем токены авторизации
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
      win.document.cookie = 'accessToken=Bearer test-access-token; path=/';
    });
    
    // Добавляем булку
    cy.contains('Краторная булка N-200i')
      .parent()
      .contains('Добавить')
      .click();
    
    // Добавляем начинку
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .contains('Добавить')
      .click();
    
    // Оформляем заказ
    cy.contains('Оформить заказ').click();
    
    // Ждем ответа
    cy.wait('@createOrder');
    
    // Проверяем, что модалка открылась (появление номера заказа)
    cy.contains('12345', { timeout: 10000 }).should('be.visible');
    
    // Закрываем модалку через Escape
    cy.get('body').type('{esc}');
    
    // Ждем, пока модалка закроется
    cy.contains('12345').should('not.exist');
    
    // Проверяем, что конструктор пуст (проверяем, что нет элементов конструктора)
    cy.get('.constructor-element').should('have.length', 0);
  });
});