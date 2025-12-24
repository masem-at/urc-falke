import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  // Primary Key
  id: serial('id').primaryKey(),

  // Authentication Fields
  email: text('email').unique().notNull(),
  password_hash: text('password_hash').notNull(),

  // Profile Fields
  first_name: text('first_name'),
  last_name: text('last_name'),
  nickname: text('nickname'), // Spitzname (displayed as "Nickname (FirstName LastName)")
  profile_image_url: text('profile_image_url'),

  // USV Membership Fields
  usv_number: text('usv_number').unique(),
  is_usv_verified: boolean('is_usv_verified').default(false),

  // Authorization Fields
  role: text('role').default('member'), // 'member' | 'admin'

  // Community Fields
  is_founding_member: boolean('is_founding_member').default(false),
  lottery_registered: boolean('lottery_registered').default(false),

  // Two-Track Onboarding Fields (Track A: Existing Members)
  onboarding_token: text('onboarding_token').unique(),
  onboarding_token_expires: timestamp('onboarding_token_expires'),
  onboarding_status: text('onboarding_status'), // 'pre_seeded' | 'password_changed' | 'completed'
  must_change_password: boolean('must_change_password').default(false),

  // Timestamps
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// Type Inference (Drizzle automatically infers types)
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Onboarding Status Type
export type OnboardingStatus = 'pre_seeded' | 'password_changed' | 'completed';

// User Role Type
export type UserRole = 'member' | 'admin';
