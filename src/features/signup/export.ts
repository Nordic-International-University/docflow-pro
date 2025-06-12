// signup/export.ts
export { default as SignupComponent } from './components/Signup.component';

export { useSignup } from './hooks/useSignup.hook';

export { signupService } from './services/signup.service';

export { default as signupReducer } from './store/signup.slice';

export type { SignupState, SignupProps } from './types/signup.types';
