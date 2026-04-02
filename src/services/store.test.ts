import store from './store';

describe('rootReducer', () => {
  it('должен правильно инициализировать store', () => {
    const state = store.getState();
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('orders');
  });

  it('должен иметь правильные начальные состояния редьюсеров', () => {
    const state = store.getState();
    expect(state.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
    expect(state.user).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null
    });
    expect(state.order).toEqual({
      order: null,
      orderRequest: false,
      orderModalData: null,
      error: null
    });
    expect(state.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: true,
      error: null
    });
    expect(state.orders).toEqual({
      orders: [],
      loading: true,
      error: null
    });
  });
});