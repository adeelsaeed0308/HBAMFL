db.users.updateMany({}, { $rename: { role: "priceSheetsRole" } });
db.users.updateMany(
  { priceSheetsRole: "Admin" },
  { $set: { admin: true, sourcingRole: "Admin" } }
);
db.users.updateMany(
  { priceSheetsRole: "SalesRep" },
  { $set: { sourcingRole: "SalesRep" } }
);
