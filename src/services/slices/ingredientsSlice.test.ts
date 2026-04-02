import ingredientsSlice, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

// Моковые данные
const mockIngredients: TIngredient[] = [
  {
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
  },
  {
    _id: 'sauce-1',
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
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null
  };

  describe('fetchIngredients', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsSlice(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять ингредиенты и снимать isLoading при fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsSlice(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('должен сохранять ошибку и снимать isLoading при rejected', () => {
      const errorMessage = 'Ошибка загрузки';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsSlice(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });
  });
});