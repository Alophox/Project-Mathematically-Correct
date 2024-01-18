import React from 'react';

interface ConditionalWrapperProps {
	condition: boolean,
	wrapper: (children: React.ReactNode) => JSX.Element,
	children: React.ReactNode
}

export const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({condition, wrapper, children}) => {
	return (
		condition ? wrapper(children) : <>{children}</>
	);
}