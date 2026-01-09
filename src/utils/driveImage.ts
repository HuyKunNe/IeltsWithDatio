export function driveImageUrl(input: string | null | undefined): string {
  if (!input) return "";
  const s = input.trim();

  // If it already looks like a direct Drive uc URL, return as-is
  if (s.includes("drive.google.com/uc")) return s;

  try {
    const u = new URL(s);
    const host = u.hostname || "";

    // Check common Google Drive hosts
    if (
      host.includes("drive.google.com") ||
      host.includes("usercontent.google.com") ||
      host.includes("googleusercontent.com")
    ) {
      // Extract id from query param
      const idParam = u.searchParams.get("id");
      if (idParam)
        return `https://drive.google.com/uc?export=view&id=${idParam}`;

      // Extract from /d/<id>/ path
      const pathMatch = s.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
      if (pathMatch)
        return `https://drive.google.com/uc?export=view&id=${pathMatch[1]}`;

      // Fallback: try to find id anywhere in query
      const anyId = s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (anyId)
        return `https://drive.google.com/uc?export=view&id=${anyId[1]}`;

      return s;
    }
  } catch (e) {
    // Not a full URL -> maybe the input is the file id itself
    const idOnly = s.match(/^([a-zA-Z0-9_-]{10,})$/);
    if (idOnly)
      return `https://drive.google.com/uc?export=view&id=${idOnly[1]}`;
    return s;
  }

  return s;
}

export function driveImageFallbacks(
  input: string | null | undefined
): string[] {
  const list: string[] = [];
  if (!input) return list;
  const s = input.trim();

  // Start with canonical view URL
  const canonical = driveImageUrl(s);
  if (canonical) list.push(canonical);

  // try to extract file id
  let id: string | null = null;
  const idMatch1 = s.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (idMatch1) id = idMatch1[1];
  if (!id) {
    const idMatch2 = s.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
    if (idMatch2) id = idMatch2[1];
  }
  if (!id) {
    const idOnly = s.match(/^([a-zA-Z0-9_-]{10,})$/);
    if (idOnly) id = idOnly[1];
  }

  if (id) {
    // download endpoint
    list.push(`https://drive.google.com/uc?export=download&id=${id}`);
    // docs download (alternate host)
    list.push(`https://docs.google.com/uc?export=download&id=${id}`);
    // thumbnail endpoints (various sizes)
    list.push(`https://drive.google.com/thumbnail?id=${id}&sz=w1600`);
    list.push(`https://drive.google.com/thumbnail?id=${id}&sz=w800`);
    list.push(`https://drive.google.com/thumbnail?id=${id}&sz=w400`);
  }

  // Remove duplicates while preserving order
  const seen = new Set<string>();
  return list.filter((u) => {
    if (!u) return false;
    if (seen.has(u)) return false;
    seen.add(u);
    return true;
  });
}
