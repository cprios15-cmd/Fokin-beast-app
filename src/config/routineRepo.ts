import type { RoutineRepo } from '../types/routines';
import { routineRepoLocal } from '../repositories/routineRepo.local';
// import { routineRepoFirebase } from '../repositories/routineRepo.firebase'; // futuro

type GetRepoParams = {
  userId?: string;
};

/**
 * Devuelve el repositorio activo.
 * Ahora: AsyncStorage
 * Futuro: Firebase sin tocar stores ni pantallas
 */
export function getRoutineRepo(_params?: GetRepoParams): RoutineRepo {
  // 👉 cuando metas Firebase:
  // if (_params?.userId) {
  //   return routineRepoFirebase(_params.userId);
  // }

  return routineRepoLocal;
}
