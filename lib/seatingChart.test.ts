import { findTableByGuestName, parseSeatingChartCsv, rankGuestMatches } from "./seatingChart";

describe("seating chart helpers", () => {
  const csv = `Table,0,Table,1
Zoe,Baker,David,Fuehne
Duncan,Fuehne,Holly,Trellue
`;

  it("parses the seating chart into numbered tables with guest names", () => {
    const tables = parseSeatingChartCsv(csv);

    expect(tables).toHaveLength(2);
    expect(tables[0]).toMatchObject({
      tableNumber: 0,
      guests: ["Zoe Baker", "Duncan Fuehne"],
    });
    expect(tables[1]).toMatchObject({
      tableNumber: 1,
      guests: ["David Fuehne", "Holly Trellue"],
    });
    expect(tables[0]?.guests).not.toContain("Table 0");
  });

  it("ranks the closest guest matches first", () => {
    const tables = parseSeatingChartCsv(csv);
    const matches = rankGuestMatches("zo", tables);

    expect(matches[0]?.name).toBe("Zoe Baker");
    expect(matches[0]?.tableNumber).toBe(0);
  });

  it("looks up the selected guest's table and tablemates", () => {
    const tables = parseSeatingChartCsv(csv);
    const result = findTableByGuestName("holly", tables);

    expect(result).toMatchObject({
      tableNumber: 1,
      guests: ["David Fuehne", "Holly Trellue"],
    });
  });
});
