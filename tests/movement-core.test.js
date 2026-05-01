const assert = require("assert");
const movement = require("../movement-core");

const source = {
  id: "unit-1",
  coords: [13.405, 52.52],
  speed: 0.2,
};
const target = {
  id: "munich",
  center: [11.582, 48.1351],
};

const order = movement.createMoveOrder(source, target, 1000);

assert.strictEqual(order.unitId, "unit-1");
assert.strictEqual(order.toProvinceId, "munich");
assert.ok(Array.isArray(order.path), "path should be an array");
assert.ok(order.path.length >= 5, "route should be a curved multi-point path");
assert.deepStrictEqual(order.path[0], source.coords);
assert.deepStrictEqual(order.path[order.path.length - 1], target.center);

const midpoint = movement.positionAlongPath(order.path, 0.5);
assert.ok(Array.isArray(midpoint), "interpolated point should be lng/lat");
assert.notDeepStrictEqual(midpoint, source.coords);
assert.notDeepStrictEqual(midpoint, target.center);

const progressed = movement.advanceMoveOrder(order, 1250);
assert.ok(progressed.progress > 0, "move order should advance after time passes");
assert.ok(progressed.position[0] !== source.coords[0] || progressed.position[1] !== source.coords[1], "unit should leave its origin");

const completed = movement.advanceMoveOrder(order, 1000 + order.durationMs + 50);
assert.strictEqual(completed.done, true);
assert.strictEqual(completed.progress, 1);
assert.deepStrictEqual(completed.position, target.center);

const nearestProvince = movement.nearestProvinceForUnit(
  { id: "unit-2", owner: "germany" },
  [
    { id: "paris", ownerId: "france", center: [2.3522, 48.8566] },
    { id: "berlin", ownerId: "germany", center: [13.405, 52.52] },
    { id: "munich", ownerId: "germany", center: [11.582, 48.1351] },
  ],
  [12.2, 49.1]
);

assert.strictEqual(nearestProvince.id, "munich");

console.log("movement-core ok");
