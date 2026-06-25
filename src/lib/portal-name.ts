import { envVars } from "./env";

const stripTrailingSlash = (value: string) => value.replace(/\/$/, "");
const GROUP_PREFIX = "group--";
const ORG_SEPARATOR = "--";

export function getDmsOwnerSlug() {
  const dms = envVars.dms;

  if (!dms) {
    return "";
  }

  const cleaned = stripTrailingSlash(dms);
  const match = cleaned.match(/\/@([^/]+)$/);

  return match?.[1] ?? "";
}

export function stripDmsOwnerPrefix(value: string) {
  const ownerSlug = envVars.mainOrg || getDmsOwnerSlug();

  if (!ownerSlug) {
    return value;
  }

  const prefix = `${ownerSlug}-`;

  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

export function stripGroupPrefix(value: string) {
  return value.startsWith(GROUP_PREFIX)
    ? value.slice(GROUP_PREFIX.length)
    : value;
}

export function addDmsOwnerPrefix(value: string) {
  const ownerSlug = envVars.mainOrg || getDmsOwnerSlug();

  if (!ownerSlug || !value) {
    return value;
  }

  const prefix = `${ownerSlug}-`;

  return value.startsWith(prefix) ? value : `${prefix}${value}`;
}

export function toPublicGroupSlug(groupName: string) {
  return stripGroupPrefix(stripDmsOwnerPrefix(groupName));
}

export function toCkanGroupName(groupSlug: string) {
  return addDmsOwnerPrefix(groupSlug);
}

export function toSearchGroupName(groupSlug: string) {
  const base = toPublicGroupSlug(groupSlug);

  return envVars.mainOrg ? `${envVars.mainOrg}-${GROUP_PREFIX}${base}` : base;
}

export function toPublicOrgSlug(orgName: string) {
  const ownerSlug = envVars.mainOrg;

  if (!ownerSlug) {
    return orgName;
  }

  const prefix = `${ownerSlug}${ORG_SEPARATOR}`;

  return orgName.startsWith(prefix) ? orgName.slice(prefix.length) : orgName;
}

export function toSearchOrgName(orgSlug: string) {
  const base = toPublicOrgSlug(orgSlug);

  if (!envVars.mainOrg) {
    return base;
  }

  return base === envVars.mainOrg
    ? base
    : `${envVars.mainOrg}${ORG_SEPARATOR}${base}`;
}

export function getCkanGroupNameCandidates(groupSlug: string) {
  const base = stripGroupPrefix(stripDmsOwnerPrefix(groupSlug));
  const variants = [
    base,
    addDmsOwnerPrefix(base),
    `${GROUP_PREFIX}${base}`,
    addDmsOwnerPrefix(`${GROUP_PREFIX}${base}`),
  ].filter(Boolean);

  return [...new Set(variants)];
}
