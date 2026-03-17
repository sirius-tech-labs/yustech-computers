
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children, disabled = false }) => {
  const [startY, setStartY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled) return;
    if (window.scrollY === 0 && !refreshing) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;
      if (distance > 0) {
        setPulling(true);
        setPullDistance(Math.min(distance * 0.5, threshold + 20));
        if (distance > 10) {
          e.preventDefault();
        }
      }
    }
  };

  const handleTouchEnd = async () => {
    if (disabled) {
      setPulling(false);
      setPullDistance(0);
      return;
    }
    if (pulling) {
      if (pullDistance >= threshold) {
        setRefreshing(true);
        setPullDistance(threshold);
        await onRefresh();
        setRefreshing(false);
      }
      setPulling(false);
      setPullDistance(0);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      <motion.div
        style={{ height: pullDistance }}
        className="overflow-hidden flex items-center justify-center bg-gray-50"
      >
        <motion.div
          animate={{ rotate: refreshing ? 360 : pullDistance * 2 }}
          transition={refreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: "spring" }}
          className="text-brand-primary"
        >
          <RefreshCw size={24} className={refreshing ? "animate-spin" : ""} />
        </motion.div>
      </motion.div>
      <motion.div
        animate={{ y: pullDistance }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
