'use client';

import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function ReduxProvider({ children }: { children: ReactNode }): ReactElement {
	return <Provider store={store}>{children}</Provider>;
}
