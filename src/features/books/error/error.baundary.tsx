import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
children: ReactNode;
}

interface State {
hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
constructor(props: Props) {
super(props);
this.state = { hasError: false };
}

static getDerivedStateFromError(_: Error): State {
return { hasError: true };
}

componentDidCatch(error: Error, errorInfo: ErrorInfo) {
console.error('Uncaught error:', error, errorInfo);
}

render() {
if (this.state.hasError) {
return (
<div>
    <h1>❌ Xatolik yuz berdi</h1>
    <p>Iltimos, sahifani yangilang yoki administratorga murojaat qiling.</p>
</div>
);
}

return this.props.children;
}
}
