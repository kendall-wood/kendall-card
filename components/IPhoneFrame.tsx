'use client';

import { useState } from 'react';
import styles from './IPhoneFrame.module.css';

interface IPhoneFrameProps {
  url: string;
  title?: string;
  orientation?: 'portrait' | 'landscape';
}

export default function IPhoneFrame({ 
  url, 
  title = "Live Preview",
  orientation = 'portrait' 
}: IPhoneFrameProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={styles.container}>
      <div className={`${styles.iphone} ${orientation === 'landscape' ? styles.landscape : ''}`}>
        {/* iPhone outer frame */}
        <div className={styles.frame}>
          {/* Notch / Dynamic Island */}
          <div className={styles.notch}>
            <div className={styles.camera}></div>
            <div className={styles.speaker}></div>
          </div>

          {/* Screen */}
          <div className={styles.screen}>
            {isLoading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
              </div>
            )}
            <iframe
              src={url}
              className={styles.iframe}
              title={title}
              onLoad={() => setIsLoading(false)}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>

          {/* Home Indicator */}
          <div className={styles.homeIndicator}></div>

          {/* Side Buttons */}
          <div className={styles.volumeUp}></div>
          <div className={styles.volumeDown}></div>
          <div className={styles.powerButton}></div>
        </div>
      </div>
    </div>
  );
}

