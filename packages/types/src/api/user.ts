export type {
  UserGraphQL,
  UserConnection,
  LoginInput,
  RegisterInput,
  UserQueryVariables,
  AuthPayload,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from '../types/user.types';

// Legacy type kept for backward compatibility
import { Address } from '../types/order.types';
export interface CreateAddressRequest extends Omit<Address, 'id' | 'userId'> {}
