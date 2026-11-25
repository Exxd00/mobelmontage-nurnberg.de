import { findCity, findService } from "./service-directory";
import { legacyCitySlugs, legacyLabel } from "./legacy-city-slugs";
import type { DirectoryReference, InquiryIds } from "./inquiry-context";

export function resolveDirectoryReference({ task, city }: InquiryIds): DirectoryReference {
  const reference: DirectoryReference = {};
  const service = task && findService(task);
  if (service) reference.task = { slug: service.slug, name: service.name, parent: service.parentId };
  if (city) {
    const area = findCity(city);
    if (area) reference.city = { slug: area.slug, name: area.name };
    else if (legacyCitySlugs.has(city)) reference.city = { slug: city, name: legacyLabel(city), unconfirmed: true };
  }
  return reference;
}
