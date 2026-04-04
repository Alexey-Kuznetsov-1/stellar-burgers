import store from './store';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';

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

  it('handles unknown action correctly', () => {
    const initAction = { type: '@@INIT' };

    // Проверяем, что после неизвестного экшена состояние не изменилось
    expect(store.getState().ingredients).toEqual(
      ingredientsReducer(undefined, initAction)
    );
    expect(store.getState().burgerConstructor).toEqual(
      constructorReducer(undefined, initAction)
    );
    expect(store.getState().user).toEqual(userReducer(undefined, initAction));
    expect(store.getState().order).toEqual(orderReducer(undefined, initAction));
    expect(store.getState().feed).toEqual(feedReducer(undefined, initAction));
    expect(store.getState().orders).toEqual(
      ordersReducer(undefined, initAction)
    );
  });
});
