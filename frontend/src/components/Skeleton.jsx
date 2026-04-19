import React from 'react';

export function SkeletonCard({ height = 80 }) {
  return (
    <div className="skeleton-card" style={{ height }}>
      <div className="skeleton-line" style={{ width: '60%', height: 14 }} />
      <div className="skeleton-line" style={{ width: '40%', height: 10, marginTop: 10 }} />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <div className="skeleton-circle" />
      <div style={{ flex: 1 }}>
        <div className="skeleton-line" style={{ width: '50%', height: 12 }} />
        <div className="skeleton-line" style={{ width: '30%', height: 10, marginTop: 6 }} />
      </div>
      <div className="skeleton-line" style={{ width: 80, height: 14 }} />
    </div>
  );
}
