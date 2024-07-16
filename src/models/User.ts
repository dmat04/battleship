/**
 * Models for the two User types (guest and registered) are defined here.
 */

/**
 * Generic user model interface - contains only the id and a username, the other two types
 * of users are created as discriminated Models on the generic user.
 */
export interface User {
  readonly id: string;
  readonly username: string;
}

/**
 * Registered User schema interface
 */
export interface RegisteredUser extends User {
  readonly passwordHash: string;
}

/**
 * Guest User schema interface
 */
export interface GuestUser extends User {
  readonly expiresAt: Date;
}
