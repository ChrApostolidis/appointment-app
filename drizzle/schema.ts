import {
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

export const userRoles = ["admin", "user", "provider"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_roles", userRoles);

export const UserTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password").notNull(),
  salt: varchar("salt", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull(),
  isProfileComplete: varchar("is_profile_complete").default("false").notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const CustomerTable = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  interests: varchar("interests", { length: 255 }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const ProviderTable = pgTable("providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  businessName: varchar("business_name", { length: 100 }).notNull(),
  serviceCategory: varchar("service_category", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),
  logoId: varchar("logo_id", { length: 128 }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const logoInfoTable = pgTable("logo_info", {
  logoId: varchar("logo_id", { length: 128 }).primaryKey(),
  logoUrl: varchar("logo_url").notNull(),
  userId: uuid("user_id").references(() => UserTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type StoredDayRange = {
  start: string;
  end: string;
  enabled: boolean;
};

export type StoredWeeklyHours = Record<string, StoredDayRange>;

export const ProviderHoursTable = pgTable("provider_working_hours", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  hours: jsonb("hours").$type<StoredWeeklyHours>().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const appoinmentsTable = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerId: uuid("provider_id")
    .notNull()
    .references(() => ProviderTable.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  startAt: timestamp({ withTimezone: true }).notNull(), // ex 2025-06-01T12:00:00.000Z
  endAt: timestamp({ withTimezone: true }).notNull(),
  notes: varchar("notes", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull().default("scheduled"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Database mapping for drizzle generic
export type Database = {
  UserTable: typeof UserTable;
  CustomerTable: typeof CustomerTable;
  ProviderTable: typeof ProviderTable;
  ProviderHoursTable: typeof ProviderHoursTable;
};
