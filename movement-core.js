(function movementCoreFactory(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.WorldMandateMovement = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function movementCoreApi() {
  function clamp01(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(1, value));
  }

  function distanceLngLat(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return 0;
    const dx = Number(b[0]) - Number(a[0]);
    const dy = Number(b[1]) - Number(a[1]);
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return 0;
    return Math.hypot(dx, dy);
  }

  function curvedRoute(start, end, samples) {
    const count = Math.max(5, samples || 18);
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const distance = Math.max(Math.hypot(dx, dy), 0.01);
    const bend = Math.min(distance * 0.18, 3.2);
    const control = [
      (start[0] + end[0]) / 2 + (-dy / distance) * bend,
      (start[1] + end[1]) / 2 + (dx / distance) * bend,
    ];
    const path = [];

    for (let index = 0; index < count; index += 1) {
      const t = index / (count - 1);
      const inv = 1 - t;
      path.push([
        (inv * inv * start[0]) + (2 * inv * t * control[0]) + (t * t * end[0]),
        (inv * inv * start[1]) + (2 * inv * t * control[1]) + (t * t * end[1]),
      ]);
    }

    path[0] = start.slice();
    path[path.length - 1] = end.slice();
    return path;
  }

  function positionAlongPath(path, progress) {
    if (!Array.isArray(path) || path.length === 0) return null;
    if (path.length === 1) return path[0].slice();
    const target = clamp01(progress);
    if (target <= 0) return path[0].slice();
    if (target >= 1) return path[path.length - 1].slice();

    const lengths = [];
    let total = 0;
    for (let index = 1; index < path.length; index += 1) {
      const length = distanceLngLat(path[index - 1], path[index]);
      lengths.push(length);
      total += length;
    }
    if (total <= 0) return path[path.length - 1].slice();

    const wanted = total * target;
    let travelled = 0;
    for (let index = 1; index < path.length; index += 1) {
      const segment = lengths[index - 1];
      if (travelled + segment >= wanted) {
        const local = segment <= 0 ? 0 : (wanted - travelled) / segment;
        const from = path[index - 1];
        const to = path[index];
        return [
          from[0] + ((to[0] - from[0]) * local),
          from[1] + ((to[1] - from[1]) * local),
        ];
      }
      travelled += segment;
    }

    return path[path.length - 1].slice();
  }

  function createMoveOrder(unit, targetProvince, now, options) {
    const start = unit && Array.isArray(unit.coords) ? unit.coords.slice() : null;
    const end = targetProvince && Array.isArray(targetProvince.center) ? targetProvince.center.slice() : null;
    if (!unit || !unit.id || !start || !end) return null;
    const speed = Math.max(Number(unit.speed || unit.movementSpeed || 0.2), 0.05);
    const distance = distanceLngLat(start, end);
    const durationMs = options && options.durationMs
      ? options.durationMs
      : Math.max(2200, Math.min(10500, (distance * 520) / speed));

    return {
      id: `${unit.id}-${targetProvince.id}-${Math.round(now || Date.now())}`,
      unitId: unit.id,
      fromProvinceId: unit.provinceId || unit.regionId || null,
      toProvinceId: targetProvince.id,
      startedAt: now || Date.now(),
      durationMs,
      path: curvedRoute(start, end, options && options.samples),
      progress: 0,
    };
  }

  function advanceMoveOrder(order, now) {
    if (!order || !Array.isArray(order.path)) return null;
    const elapsed = Math.max(0, (now || Date.now()) - order.startedAt);
    const progress = clamp01(elapsed / Math.max(order.durationMs || 1, 1));
    return {
      ...order,
      progress,
      position: positionAlongPath(order.path, progress),
      done: progress >= 1,
    };
  }

  return {
    advanceMoveOrder,
    createMoveOrder,
    curvedRoute,
    distanceLngLat,
    positionAlongPath,
  };
}));
