import { Component } from 'react';
import { useProgress } from '@react-three/drei';
import fallbackImage from '../iphone.webp';

/** Shows a static product image if WebGL is unavailable or the model fails to load. */
export class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn('[3D] Falling back to a static image:', error?.message);
  }

  render() {
    if (this.state.failed) {
      return (
        this.props.fallback ?? (
          <div className="scene-fallback">
            <img src={fallbackImage} alt="iPhone 15 Pro in four titanium finishes" />
          </div>
        )
      );
    }
    return this.props.children;
  }
}

/** Subtle progress indicator while GLB / HDR assets stream in. */
export function SceneLoader({ label = 'Loading 3D model' }) {
  const { active, progress } = useProgress();
  const visible = active && progress < 100;
  return (
    <div className={`scene-loader ${visible ? 'is-visible' : ''}`} role="status" aria-live="polite" aria-hidden={!visible}>
      <span className="scene-loader-ring" />
      <span className="scene-loader-text">
        {label} · {Math.round(progress)}%
      </span>
    </div>
  );
}
