export type SeatingTable = {
  tableNumber: number;
  guests: string[];
};

export type SearchableGuest = {
  name: string;
  tableNumber: number;
};

export type GuestMatch = {
  name: string;
  tableNumber: number;
  score: number;
};

export function parseSeatingChartCsv(csvText: string): SeatingTable[] {
  const rows = csvText
    .split(/\r?\n/)
    .map((row) => row.split(","))
    .filter((row) => row.some((value) => value.trim().length > 0));

  if (rows.length === 0) {
    return [];
  }

  const tableCount = Math.max(
    1,
    ...rows.map((row) => Math.max(0, Math.floor(row.length / 2)))
  );

  const tables: SeatingTable[] = Array.from({ length: tableCount }, (_, index) => ({
    tableNumber: index,
    guests: [],
  }));

  for (const row of rows) {
    const isHeaderRow =
      row.length > 1 &&
      row.every((cell, index) => {
        const trimmed = cell.trim();
        return index % 2 === 0 ? trimmed.toLowerCase() === "table" : trimmed !== "" && !Number.isNaN(Number(trimmed));
      });

    if (isHeaderRow) {
      continue;
    }

    for (let tableIndex = 0; tableIndex < tableCount; tableIndex += 1) {
      const firstName = (row[tableIndex * 2] ?? "").trim();
      const lastName = (row[tableIndex * 2 + 1] ?? "").trim();

      if (!firstName || !lastName) {
        continue;
      }

      if (firstName.toLowerCase() === "table" || Number.isFinite(Number(firstName))) {
        continue;
      }

      const table = tables[tableIndex];
      if (!table) {
        continue;
      }

      const guestName = `${firstName} ${lastName}`.trim();
      if (guestName && !table.guests.includes(guestName)) {
        table.guests.push(guestName);
      }
    }
  }

  return tables.filter((table) => table.guests.length > 0);
}

function normalizeName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ");
}

function getMatchingScore(query: string, name: string) {
  const normalizedQuery = normalizeName(query);
  const normalizedName = normalizeName(name);

  if (!normalizedQuery) {
    return Number.POSITIVE_INFINITY;
  }

  if (normalizedName === normalizedQuery) {
    return 0;
  }

  if (normalizedName.startsWith(normalizedQuery)) {
    return 1;
  }

  if (normalizedName.includes(normalizedQuery)) {
    return 2;
  }

  const queryParts = normalizedQuery.split(" ");
  const nameParts = normalizedName.split(" ");
  const includesAllParts = queryParts.every((part) => nameParts.some((namePart) => namePart.includes(part)));

  if (includesAllParts) {
    return 3;
  }

  const distance = normalizedName.length - normalizedQuery.length;
  return distance < 0 ? 4 + Math.abs(distance) : 5 + distance;
}

function isPlusOneGuestName(guestName: string) {
  const lastName = guestName.split(" ").at(-1)?.trim().toLowerCase();
  return lastName === "plus" || lastName === "1" || guestName.toLowerCase().includes("plus 1");
}

export function rankGuestMatches(query: string, tables: SeatingTable[]): GuestMatch[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const matches: GuestMatch[] = [];

  for (const table of tables) {
    for (const guestName of table.guests) {
      if (isPlusOneGuestName(guestName)) {
        continue;
      }

      matches.push({
        name: guestName,
        tableNumber: table.tableNumber,
        score: getMatchingScore(trimmedQuery, guestName),
      });
    }
  }

  return matches
    .filter((match) => Number.isFinite(match.score))
    .sort((left, right) => left.score - right.score || left.name.localeCompare(right.name));
}

export function findTableByGuestName(query: string, tables: SeatingTable[]) {
  const guestName = rankGuestMatches(query, tables)[0]?.name;

  if (!guestName) {
    return null;
  }

  const table = tables.find((entry) => entry.guests.includes(guestName));

  if (!table) {
    return null;
  }

  return {
    tableNumber: table.tableNumber,
    guests: table.guests,
  };
}
