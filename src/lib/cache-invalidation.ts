"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "./cached-queries";

async function invalidateTag(tag: string) {
  revalidateTag(tag, "max");
}

export async function invalidatePackages() {
  await invalidateTag(CACHE_TAGS.PACKAGES);
}

export async function invalidateBackgrounds() {
  await invalidateTag(CACHE_TAGS.BACKGROUNDS);
}

export async function invalidateAddons() {
  await invalidateTag(CACHE_TAGS.ADDONS);
}

export async function invalidateLeads() {
  await invalidateTag(CACHE_TAGS.LEADS);
}

export async function invalidateDomiciles() {
  await invalidateTag(CACHE_TAGS.DOMICILES);
}

export async function invalidatePhotoFor() {
  await invalidateTag(CACHE_TAGS.PHOTO_FOR);
}

export async function invalidateCustomFields() {
  await invalidateTag(CACHE_TAGS.CUSTOM_FIELDS);
}

export async function invalidateSettingsGeneral() {
  await invalidateTag(CACHE_TAGS.SETTINGS_GENERAL);
}

export async function invalidateStudioInfo() {
  await invalidateTag(CACHE_TAGS.SETTINGS_STUDIO_INFO);
}

export async function invalidateReminderTemplates() {
  await invalidateTag(CACHE_TAGS.SETTINGS_REMINDER_TEMPLATES);
}

export async function invalidateHolidays() {
  await invalidateTag(CACHE_TAGS.STUDIO_HOLIDAYS);
}

export async function invalidateRoles() {
  await invalidateTag(CACHE_TAGS.ROLES);
}

export async function invalidateActiveUsers() {
  await invalidateTag(CACHE_TAGS.USERS_ACTIVE);
}

export async function invalidateActiveVendors() {
  await invalidateTag(CACHE_TAGS.VENDORS_ACTIVE);
}
