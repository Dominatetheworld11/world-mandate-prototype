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

const routedProvinces = [
  { id: "berlin", center: [13.405, 52.52], neighbors: ["saxony"] },
  { id: "saxony", center: [12.3731, 51.3397], neighbors: ["berlin", "munich"] },
  { id: "munich", center: [11.582, 48.1351], neighbors: ["saxony"] },
];
const routedOrder = movement.createMoveOrder(
  { id: "unit-route", coords: routedProvinces[0].center, provinceId: "berlin", speed: 0.2 },
  routedProvinces[2],
  2000,
  { provinces: routedProvinces, samplesPerSegment: 6, segmentDurationMs: 1000, pauseMs: 500 }
);

assert.deepStrictEqual(
  routedOrder.provincePath,
  ["berlin", "saxony", "munich"],
  "movement should route through neighboring provinces"
);
assert.ok(
  routedOrder.path.some((point) => point[0] === routedProvinces[1].center[0] && point[1] === routedProvinces[1].center[1]),
  "route line should pass through the intermediate province center"
);
assert.strictEqual(routedOrder.segments.length, 2, "route should be split into province-to-province segments");
assert.deepStrictEqual(
  routedOrder.segments.map((segment) => [segment.fromProvinceId, segment.toProvinceId]),
  [["berlin", "saxony"], ["saxony", "munich"]]
);

const pausedAtSaxony = movement.advanceMoveOrder(routedOrder, 3250);
assert.strictEqual(pausedAtSaxony.paused, true, "unit should pause briefly between province segments");
assert.strictEqual(pausedAtSaxony.currentProvinceId, "saxony");
assert.deepStrictEqual(pausedAtSaxony.position, routedProvinces[1].center);

const movingOnSecondSegment = movement.advanceMoveOrder(routedOrder, 3750);
assert.strictEqual(movingOnSecondSegment.paused, false);
assert.strictEqual(movingOnSecondSegment.currentSegmentIndex, 1);

const blockedLongRoute = movement.createMoveOrder(
  { id: "unit-blocked", coords: routedProvinces[0].center, provinceId: "berlin", speed: 0.2 },
  routedProvinces[2],
  2000,
  { provinces: routedProvinces, maxProvinceSteps: 1, requireProvincePath: true }
);
assert.strictEqual(blockedLongRoute, null, "long moves beyond maxProvinceSteps should be blocked");

const friendlyRate = movement.captureRateFor("germany", "germany");
const neutralRate = movement.captureRateFor("germany", null);
const enemyRate = movement.captureRateFor("germany", "france");
assert.strictEqual(friendlyRate, 0, "friendly provinces should not be captured");
assert.ok(neutralRate > enemyRate, "neutral provinces should capture faster than enemy provinces");
assert.ok(enemyRate > 0, "enemy provinces should be capturable");

const captureProgress = movement.advanceCaptureProgress({ progress: 25 }, 5000, 5);
assert.strictEqual(captureProgress.progress, 50, "capture should advance by elapsed time and rate");
assert.strictEqual(captureProgress.complete, false);

const captureComplete = movement.advanceCaptureProgress({ progress: 95 }, 2000, 5);
assert.strictEqual(captureComplete.progress, 100, "capture should clamp at 100");
assert.strictEqual(captureComplete.complete, true);

const eta = movement.movementEtaForOrder(routedOrder);
assert.strictEqual(eta.steps, 2, "ETA should count province-to-province steps");
assert.strictEqual(eta.etaMs, routedOrder.durationMs);
assert.ok(/2 steps/.test(eta.label), "ETA label should include route step count");

assert.deepStrictEqual(
  movement.smoothPoint([0, 0], [10, 4], 0.25),
  [2.5, 1],
  "visual point smoothing should interpolate between current and target"
);
assert.deepStrictEqual(
  movement.smoothPoint([0, 0], [10, 4], 4),
  [10, 4],
  "visual point smoothing should clamp amount to the target"
);
assert.strictEqual(
  movement.smoothAngleDegrees(350, 10, 0.5),
  0,
  "angle smoothing should rotate across the shortest wraparound path"
);
assert.strictEqual(
  movement.smoothAngleDegrees(10, 350, 0.5),
  0,
  "angle smoothing should rotate backward across the shortest wraparound path"
);

console.log("movement-core ok");
