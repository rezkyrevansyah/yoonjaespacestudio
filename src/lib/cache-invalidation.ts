"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "./cached-queries";

export async function invalidatePackages() {
  revalidateTag(CACHE_TAGS.PACKAGES, "max");
}

export async function invalidateBackgrounds() {
  revalidateTag(CACHE_TAGS.BACKGROUNDS, "max");
}

export async function invalidateAddons() {
  revalidateTag(CACHE_TAGS.ADDONS, "max");
}

export async function invalidateLeads() {
  revalidateTag(CACHE_TAGS.LEADS, "max");
}

export async function invalidateDomiciles() {
  revalidateTag(CACHE_TAGS.DOMICILES, "max");
}

export async function invalidatePhotoFor() {
  revalidateTag(CACHE_TAGS.PHOTO_FOR, "max");
}

export async function invalidateCustomFields() {
  revalidateTag(CACHE_TAGS.CUSTOM_FIELDS, "max");
}

export async function invalidateSettingsGeneral() {
  revalidateTag(CACHE_TAGS.SETTINGS_GENERAL, "max");
}

export async function invalidateStudioInfo() {
  revalidateTag(CACHE_TAGS.SETTINGS_STUDIO_INFO, "max");
}

export async function invalidateReminderTemplates() {
  revalidateTag(CACHE_TAGS.SETTINGS_REMINDER_TEMPLATES, "max");
}

export async function invalidateHolidays() {
  revalidateTag(CACHE_TAGS.STUDIO_HOLIDAYS, "max");
}

export async function invalidateRoles() {
  revalidateTag(CACHE_TAGS.ROLES, "max");
}

export async function invalidateActiveUsers() {
  revalidateTag(CACHE_TAGS.USERS_ACTIVE, "max");
}

export async function invalidateActiveVendors() {
  revalidateTag(CACHE_TAGS.VENDORS_ACTIVE, "max");
}
