import { Link2 } from "lucide-react";
import { PROVIDER_REGISTRY } from "./providerRegistry";
import type { SocialLinks } from "../types/github";

const GENERIC_IDENTITY = {
  provider: "Link",
  Icon: Link2,
  color: undefined, 
};

export function extractSocialLinks(rawUrl: string): SocialLinks {
  if (!rawUrl) return { handle: "", url: "", ...GENERIC_IDENTITY };

  const normalizedUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  
  try {
    const urlObj = new URL(normalizedUrl);
    const cleanHostname = urlObj.hostname.replace(/^www\./i, "").toLowerCase();
    
    let identity = PROVIDER_REGISTRY[cleanHostname];

    if (!identity) {
      const parts = cleanHostname.split('.');
      if (parts.length > 2) {
         const rootDomain = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
         identity = PROVIDER_REGISTRY[rootDomain];
      }
    }

    let handle = normalizedUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

    if (identity && identity.provider !== "Website" && identity.provider !== "Link") {
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        handle = pathSegments[pathSegments.length - 1];
      }
    } else if (!urlObj.pathname || urlObj.pathname === "/") {
      handle = cleanHostname;
    }

    return {
      provider: identity?.provider || GENERIC_IDENTITY.provider,
      Icon: identity?.Icon || GENERIC_IDENTITY.Icon,
      color: identity?.color || GENERIC_IDENTITY.color,
      handle: handle,
      url: normalizedUrl,
    };

  } catch (error) {
    return {
      provider: GENERIC_IDENTITY.provider,
      Icon: GENERIC_IDENTITY.Icon,
      color: GENERIC_IDENTITY.color,
      handle: rawUrl,
      url: normalizedUrl,
    };
  }
}