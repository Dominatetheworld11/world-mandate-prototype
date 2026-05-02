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

  function pathDistance(path) {
    if (!Array.isArray(path) || path.length < 2) return 0;
    let total = 0;
    for (let index = 1; index < path.length; index += 1) {
      total += distanceLngLat(path[index - 1], path[index]);
    }
    return total;
  }

  function provinceNeighborIds(province) {
    if (!province) return [];
    const ids = []
      .concat(Array.isArray(province.neighbors) ? province.neighbors : [])
      .concat(Array.isArray(province.roadLinks) ? province.roadLinks : []);
    return ids.filter(Boolean);
  }

  function provinceGraph(provinces) {
    const byId = new Map();
    const adjacency = new Map();
    for (const province of provinces || []) {
      if (!province || !province.id || !Array.isArray(province.center)) continue;
      byId.set(province.id, province);
      if (!adjacency.has(province.id)) adjacency.set(province.id, new Set());
    }
    for (const province of byId.values()) {
      for (const neighborId of provinceNeighborIds(province)) {
        if (!byId.has(neighborId)) continue;
        adjacency.get(province.id).add(neighborId);
        if (!adjacency.has(neighborId)) adjacency.set(neighborId, new Set());
        adjacency.get(neighborId).add(province.id);
      }
    }
    return { byId, adjacency };
  }

  function shortestProvincePath(provinces, startId, endId) {
    if (!startId || !endId || !Array.isArray(provinces)) return [];
    const graph = provinceGraph(provinces);
    if (!graph.byId.has(startId) || !graph.byId.has(endId)) return [];
    if (startId === endId) return [graph.byId.get(startId)];

    const queue = [startId];
    const visited = new Set([startId]);
    const previous = new Map();

    while (queue.length) {
      const current = queue.shift();
      const neighbors = graph.adjacency.get(current) || new Set();
      for (const neighborId of neighbors) {
        if (visited.has(neighborId)) continue;
        visited.add(neighborId);
        previous.set(neighborId, current);
        if (neighborId === endId) {
          const ids = [endId];
          let cursor = endId;
          while (previous.has(cursor)) {
            cursor = previous.get(cursor);
            ids.unshift(cursor);
          }
          return ids.map((id) => graph.byId.get(id)).filter(Boolean);
        }
        queue.push(neighborId);
      }
    }

    return [];
  }

  function segmentedProvinceRoute(provincePath, samplesPerSegment) {
    if (!Array.isArray(provincePath) || provincePath.length < 2) return [];
    const path = [];
    for (let index = 1; index < provincePath.length; index += 1) {
      const start = provincePath[index - 1].center;
      const end = provincePath[index].center;
      if (!Array.isArray(start) || !Array.isArray(end)) continue;
      const segment = curvedRoute(start, end, samplesPerSegment || 8);
      for (let pointIndex = 0; pointIndex < segment.length; pointIndex += 1) {
        if (index > 1 && pointIndex === 0) continue;
        path.push(segment[pointIndex]);
      }
    }
    return path;
  }

  function flattenSegmentPaths(segments) {
    const path = [];
    for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
      const segment = segments[segmentIndex];
      for (let pointIndex = 0; pointIndex < segment.path.length; pointIndex += 1) {
        if (segmentIndex > 0 && pointIndex === 0) continue;
        path.push(segment.path[pointIndex]);
      }
    }
    return path;
  }

  function movementSegmentsForProvincePath(provincePath, options, speed) {
    if (!Array.isArray(provincePath) || provincePath.length < 2) return [];
    const samples = options && options.samplesPerSegment;
    const fixedDuration = options && Number.isFinite(options.segmentDurationMs)
      ? Math.max(120, Number(options.segmentDurationMs))
      : null;
    const pauseMs = options && Number.isFinite(options.pauseMs)
      ? Math.max(0, Number(options.pauseMs))
      : 260;
    const segments = [];
    let cursorMs = 0;

    for (let index = 1; index < provincePath.length; index += 1) {
      const from = provincePath[index - 1];
      const to = provincePath[index];
      const path = curvedRoute(from.center, to.center, samples || 8);
      const distance = pathDistance(path);
      const durationMs = fixedDuration || Math.max(900, Math.min(4200, (distance * 520) / speed));
      const segmentPauseMs = index < provincePath.length - 1 ? pauseMs : 0;
      const startMs = cursorMs;
      const endMs = startMs + durationMs;
      const pauseEndMs = endMs + segmentPauseMs;

      segments.push({
        fromProvinceId: from.id,
        toProvinceId: to.id,
        path,
        distance,
        startMs,
        endMs,
        pauseMs: segmentPauseMs,
        pauseEndMs,
        durationMs,
      });
      cursorMs = pauseEndMs;
    }

    return segments;
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

  function provinceOwnerKey(province) {
    return province && (province.ownerId || province.owner || province.country || province.countryId || province.ownerName);
  }

  function normalizeOwnerKey(owner) {
    if (!owner) return "";
    if (typeof owner === "object") {
      return normalizeOwnerKey(owner.ownerId || owner.owner || owner.country || owner.countryId || owner.ownerName || owner.name);
    }
    return String(owner).trim().toLowerCase();
  }

  function captureRateFor(unitOwner, provinceOwner, options) {
    const unitKey = normalizeOwnerKey(unitOwner);
    const provinceKey = normalizeOwnerKey(provinceOwner);
    const neutralRate = options && Number.isFinite(options.neutralRate)
      ? Math.max(0, Number(options.neutralRate))
      : 8;
    const enemyRate = options && Number.isFinite(options.enemyRate)
      ? Math.max(0, Number(options.enemyRate))
      : 3;

    if (!unitKey) return 0;
    if (!provinceKey || provinceKey === "neutral" || provinceKey === "unclaimed") return neutralRate;
    if (unitKey === provinceKey) return 0;
    return enemyRate;
  }

  function advanceCaptureProgress(capture, elapsedMs, ratePercentPerSecond) {
    const current = capture && Number.isFinite(Number(capture.progress)) ? Number(capture.progress) : 0;
    const elapsedSeconds = Math.max(0, Number(elapsedMs || 0) / 1000);
    const rate = Math.max(0, Number(ratePercentPerSecond || 0));
    const progress = Math.min(100, current + (elapsedSeconds * rate));
    const rounded = Number(progress.toFixed(2));
    return {
      ...(capture || {}),
      progress: rounded,
      complete: rounded >= 100,
    };
  }

  function formatEtaLabel(etaMs) {
    const seconds = Math.max(1, Math.round(Number(etaMs || 0) / 1000));
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    if (!remainder) return `${minutes}m`;
    return `${minutes}m ${remainder}s`;
  }

  function movementEtaForOrder(order, options) {
    const pathSteps = order && Array.isArray(order.provincePath)
      ? Math.max(0, order.provincePath.length - 1)
      : 0;
    const segmentSteps = order && Array.isArray(order.segments) ? order.segments.length : 0;
    const steps = Math.max(pathSteps, segmentSteps);
    const fallbackStepMs = options && Number.isFinite(options.stepMs) ? Math.max(1, Number(options.stepMs)) : 2200;
    const etaMs = order && Number.isFinite(Number(order.durationMs))
      ? Math.max(0, Number(order.durationMs))
      : steps * fallbackStepMs;
    const stepLabel = `${steps} ${steps === 1 ? "step" : "steps"}`;
    return {
      steps,
      etaMs,
      label: `${stepLabel} / ${formatEtaLabel(etaMs)}`,
    };
  }

  function nearestProvinceForUnit(unit, provinces, fallbackCoords) {
    if (!unit || !Array.isArray(provinces) || !provinces.length) return null;
    const explicitId = unit.localProvinceId || unit.provinceId;
    if (explicitId) {
      const explicit = provinces.find((province) => province && province.id === explicitId);
      if (explicit) return explicit;
    }

    const origin = Array.isArray(fallbackCoords) ? fallbackCoords : unit.coords;
    if (!Array.isArray(origin)) return null;
    const owner = unit.owner || unit.ownerId || unit.country || unit.countryId;
    const ownerMatches = provinces.filter((province) => (
      province &&
      Array.isArray(province.center) &&
      (!owner || provinceOwnerKey(province) === owner)
    ));
    const candidates = ownerMatches.length
      ? ownerMatches
      : provinces.filter((province) => province && Array.isArray(province.center));

    const nearest = candidates
      .map((province) => ({ province, distance: distanceLngLat(origin, province.center) }))
      .sort((a, b) => a.distance - b.distance)[0];
    return nearest ? nearest.province : null;
  }

  function createMoveOrder(unit, targetProvince, now, options) {
    const start = unit && Array.isArray(unit.coords) ? unit.coords.slice() : null;
    const end = targetProvince && Array.isArray(targetProvince.center) ? targetProvince.center.slice() : null;
    if (!unit || !unit.id || !start || !end) return null;
    const speed = Math.max(Number(unit.speed || unit.movementSpeed || 0.2), 0.05);
    const fromProvinceId = unit.provinceId || unit.localProvinceId || unit.regionId || null;
    const provincePath = options && Array.isArray(options.provinces)
      ? shortestProvincePath(options.provinces, fromProvinceId, targetProvince.id)
      : [];
    const requireProvincePath = Boolean(options && options.requireProvincePath);
    const maxProvinceSteps = options && Number.isFinite(options.maxProvinceSteps)
      ? Math.max(1, Number(options.maxProvinceSteps))
      : null;
    if (requireProvincePath && provincePath.length < 2) return null;
    if (maxProvinceSteps && provincePath.length >= 2 && provincePath.length - 1 > maxProvinceSteps) return null;

    const segments = movementSegmentsForProvincePath(provincePath, options, speed);
    const path = segments.length
      ? flattenSegmentPaths(segments)
      : curvedRoute(start, end, options && options.samples);
    const distance = segments.length
      ? segments.reduce((total, segment) => total + segment.distance, 0)
      : pathDistance(path) || distanceLngLat(start, end);
    const durationMs = options && options.durationMs
      ? options.durationMs
      : segments.length
        ? segments[segments.length - 1].pauseEndMs
        : Math.max(2200, Math.min(10500, (distance * 520) / speed));

    return {
      id: `${unit.id}-${targetProvince.id}-${Math.round(now || Date.now())}`,
      unitId: unit.id,
      fromProvinceId,
      toProvinceId: targetProvince.id,
      startedAt: now || Date.now(),
      durationMs,
      path,
      provincePath: provincePath.map((province) => province.id),
      segments,
      progress: 0,
    };
  }

  function advanceMoveOrder(order, now) {
    if (!order || !Array.isArray(order.path)) return null;
    const elapsed = Math.max(0, (now || Date.now()) - order.startedAt);
    const progress = clamp01(elapsed / Math.max(order.durationMs || 1, 1));
    if (Array.isArray(order.segments) && order.segments.length) {
      for (let index = 0; index < order.segments.length; index += 1) {
        const segment = order.segments[index];
        if (elapsed <= segment.endMs) {
          const localProgress = clamp01((elapsed - segment.startMs) / Math.max(segment.durationMs || 1, 1));
          return {
            ...order,
            progress,
            currentSegmentIndex: index,
            currentProvinceId: localProgress >= 1 ? segment.toProvinceId : segment.fromProvinceId,
            paused: false,
            position: positionAlongPath(segment.path, localProgress),
            done: false,
          };
        }
        if (elapsed <= segment.pauseEndMs) {
          return {
            ...order,
            progress,
            currentSegmentIndex: index,
            currentProvinceId: segment.toProvinceId,
            paused: true,
            position: segment.path[segment.path.length - 1].slice(),
            done: false,
          };
        }
      }
    }
    return {
      ...order,
      progress,
      position: positionAlongPath(order.path, progress),
      done: progress >= 1,
    };
  }

  return {
    advanceMoveOrder,
    advanceCaptureProgress,
    captureRateFor,
    createMoveOrder,
    curvedRoute,
    distanceLngLat,
    movementEtaForOrder,
    nearestProvinceForUnit,
    shortestProvincePath,
    positionAlongPath,
  };
}));
