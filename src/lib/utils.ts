import { type ClassValue, clsx } from 'clsx';
import React, { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function uuid () {
  return window.crypto.randomUUID();
}

export function cn ( ...inputs: ClassValue[] ) {
  return twMerge( clsx( inputs ) );
}

export function hasRenderableChildren ( children: ReactNode ) : boolean {
  if ( children === null || children === undefined || children === false || children === true ) return false;
  if ( Array.isArray( children ) ) return children.some( ( child ) =>
      child !== null && child !== undefined && child !== false && child !== true
  );

  return typeof children === 'string' || typeof children === 'number' || React.isValidElement( children );
}
