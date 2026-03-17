import { FC, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient } from '../../services/slices/constructorSlice';
import { RootState } from '../../services/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const constructorItems = useSelector(
      (state: RootState) => state.burgerConstructor
    );

    const actualCount =
      constructorItems.ingredients.filter((item) => item._id === ingredient._id)
        .length + (constructorItems.bun?._id === ingredient._id ? 2 : 0);

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    const handleOpenModal = () => {
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location }
      });
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={actualCount}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
