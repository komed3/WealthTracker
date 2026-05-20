import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function uuid () {
  if ( typeof crypto !== 'undefined' && crypto.randomUUID ) return crypto.randomUUID();

  const bytes = new Uint8Array( 16 );
  ( typeof crypto !== 'undefined' ? crypto.getRandomValues : require( 'crypto' ).randomFillSync )( bytes );

  bytes[ 6 ] = ( bytes[ 6 ] & 0x0f ) | 0x40;
  bytes[ 8 ] = ( bytes[ 8 ] & 0x3f ) | 0x80;

  const hex = [ ...bytes ].map( b => b.toString( 16 ).padStart( 2, '0' ) ).join( '' );
  return hex.substring( 0, 16 );
}

export function cn ( ...inputs: ClassValue[] ) {
  return twMerge( clsx( inputs ) );
}
