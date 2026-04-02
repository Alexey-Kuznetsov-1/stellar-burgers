import constructorSlice, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor,
  TConstructorIngredient
} from './constructorSlice';
import { TIngredient } from '../../utils/types';

// Мокаем crypto.randomUUID
beforeAll(() => {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => 'test-id-123'
    }
  });
});

// Моковые данные
const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '',
  image_mobile: '',
  image_large: ''
};

const mockIngredient1: TIngredient = {
  _id: 'ing-1',
  name: 'Соус',
  type: 'sauce',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 100,
  price: 50,
  image: '',
  image_mobile: '',
  image_large: ''
};

const mockIngredient2: TIngredient = {
  _id: 'ing-2',
  name: 'Котлета',
  type: 'main',
  proteins: 30,
  fat: 20,
  carbohydrates: 10,
  calories: 300,
  price: 200,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  describe('addIngredient', () => {
    it('должен добавлять булку (заменяя предыдущую)', () => {
      const firstBun = addIngredient(mockBun);
      let state = constructorSlice(initialState, firstBun);
      expect(state.bun).toEqual({ ...mockBun, id: 'test-id-123' });
      expect(state.bun?.type).toBe('bun');

      const secondBun = addIngredient(mockBun);
      state = constructorSlice(state, secondBun);
      expect(state.ingredients).toHaveLength(0);
      expect(state.bun).toEqual({ ...mockBun, id: 'test-id-123' });
    });

    it('должен добавлять начинку/соус', () => {
      const action = addIngredient(mockIngredient1);
      const state = constructorSlice(initialState, action);
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockIngredient1,
        id: 'test-id-123'
      });
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент по id', () => {
      const addAction = addIngredient(mockIngredient1);
      let state = constructorSlice(initialState, addAction);
      expect(state.ingredients).toHaveLength(1);

      const removeAction = removeIngredient(state.ingredients[0].id);
      state = constructorSlice(state, removeAction);
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredientUp', () => {
    it('должен перемещать ингредиент вверх', () => {
      const add1 = addIngredient(mockIngredient1);
      const add2 = addIngredient(mockIngredient2);
      let state = constructorSlice(initialState, add1);
      state = constructorSlice(state, add2);

      expect(state.ingredients[0]._id).toBe('ing-1');
      expect(state.ingredients[1]._id).toBe('ing-2');

      const moveAction = moveIngredientUp(1);
      state = constructorSlice(state, moveAction);

      expect(state.ingredients[0]._id).toBe('ing-2');
      expect(state.ingredients[1]._id).toBe('ing-1');
    });

    it('не должен делать ничего, если индекс 0', () => {
      const add = addIngredient(mockIngredient1);
      let state = constructorSlice(initialState, add);
      expect(state.ingredients[0]._id).toBe('ing-1');

      const moveAction = moveIngredientUp(0);
      state = constructorSlice(state, moveAction);
      expect(state.ingredients[0]._id).toBe('ing-1');
    });
  });

  describe('moveIngredientDown', () => {
    it('должен перемещать ингредиент вниз', () => {
      const add1 = addIngredient(mockIngredient1);
      const add2 = addIngredient(mockIngredient2);
      let state = constructorSlice(initialState, add1);
      state = constructorSlice(state, add2);

      expect(state.ingredients[0]._id).toBe('ing-1');
      expect(state.ingredients[1]._id).toBe('ing-2');

      const moveAction = moveIngredientDown(0);
      state = constructorSlice(state, moveAction);

      expect(state.ingredients[0]._id).toBe('ing-2');
      expect(state.ingredients[1]._id).toBe('ing-1');
    });

    it('не должен делать ничего, если индекс последний', () => {
      const add = addIngredient(mockIngredient1);
      let state = constructorSlice(initialState, add);
      expect(state.ingredients[0]._id).toBe('ing-1');

      const moveAction = moveIngredientDown(0);
      state = constructorSlice(state, moveAction);
      expect(state.ingredients[0]._id).toBe('ing-1');
    });
  });

  describe('resetConstructor', () => {
    it('должен очищать конструктор', () => {
      const addBun = addIngredient(mockBun);
      const addIng = addIngredient(mockIngredient1);
      let state = constructorSlice(initialState, addBun);
      state = constructorSlice(state, addIng);
      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(1);

      state = constructorSlice(state, resetConstructor());
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});