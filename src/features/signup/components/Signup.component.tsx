// signup/components/Signup.component.tsx
import type { SignupProps } from '../types/signup.types';

export default function SignupComponent(props: SignupProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Signup Feature!</h1>
      <p>Props ID: {props.id}</p>
    </div>
  );
}
