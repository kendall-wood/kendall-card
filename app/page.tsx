'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { portfolioData, dropdownLinks, ProjectImage } from '@/data/projects';
import styles from './page.module.css';

export default function Home() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedProject, setSelectedProject] = useState<{ category: string; project: string; imageIndex: number } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [imageLoaded, setImageLoaded] = useState(true);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const nameButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      setCurrentTime(`${timeString} New York, NY`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        const target = event.target as HTMLElement;
        if (
          nameButtonRef.current && 
          !nameButtonRef.current.contains(target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(target)
        ) {
          setDropdownOpen(false);
        }
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (!selectedProject) return;

    const category = portfolioData.find(c => c.name === selectedProject.category);
    if (!category) return;

    const project = category.projects.find(p => p.name === selectedProject.project);
    if (!project) return;

    // Only auto-scroll if there are multiple images and they're not PDFs
    const hasMultipleImages = project.images.length > 1;
    const hasNonPdfImages = project.images.some(img => !img.src.endsWith('.pdf'));

    if (hasMultipleImages && hasNonPdfImages) {
      // Set scroll interval based on project name
      let scrollInterval = 4500; // Default 4.5 seconds
      if (project.name === "Your Curtains Are Open" || project.name === "Home Can Be Replaced") {
        scrollInterval = 1000; // 1 second for these projects
      }

      const interval = setInterval(() => {
        setSelectedProject(prev => {
          if (!prev) return null;
          
          const currentCategory = portfolioData.find(c => c.name === prev.category);
          if (!currentCategory) return prev;
          
          const currentProject = currentCategory.projects.find(p => p.name === prev.project);
          if (!currentProject) return prev;
          
          const totalImages = currentProject.images.length;
          const nextIndex = (prev.imageIndex + 1) % totalImages;
          
          // Only advance if next image is loaded
          if (imageLoaded) {
            setImageLoaded(false);
            return { ...prev, imageIndex: nextIndex };
          }
          return prev;
        });
      }, scrollInterval);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [selectedProject?.category, selectedProject?.project]);

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const handleProjectClick = (categoryName: string, projectName: string) => {
    setSelectedProject({ category: categoryName, project: projectName, imageIndex: 0 });
    setShowResume(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedProject) return;
    
    const category = portfolioData.find(c => c.name === selectedProject.category);
    if (!category) return;
    
    const project = category.projects.find(p => p.name === selectedProject.project);
    if (!project) return;
    
    const totalImages = project.images.length;
    let newIndex = selectedProject.imageIndex;
    
    if (direction === 'next') {
      newIndex = (newIndex + 1) % totalImages;
    } else {
      newIndex = (newIndex - 1 + totalImages) % totalImages;
    }
    
    setSelectedProject({ ...selectedProject, imageIndex: newIndex });
  };

  const getCurrentImage = (): ProjectImage | null => {
    if (!selectedProject) return null;
    
    const category = portfolioData.find(c => c.name === selectedProject.category);
    if (!category) return null;
    
    const project = category.projects.find(p => p.name === selectedProject.project);
    if (!project) return null;
    
    return project.images[selectedProject.imageIndex] || null;
  };

  const currentImage = getCurrentImage();
  const currentProject = selectedProject 
    ? portfolioData.find(c => c.name === selectedProject.category)?.projects.find(p => p.name === selectedProject.project)
    : null;

  // Preload next image
  useEffect(() => {
    if (!selectedProject || !currentProject) return;
    
    const nextIndex = (selectedProject.imageIndex + 1) % currentProject.images.length;
    const nextImage = currentProject.images[nextIndex];
    
    if (nextImage && !nextImage.src.endsWith('.mp4') && !nextImage.src.endsWith('.mov') && !nextImage.src.endsWith('.pdf')) {
      const img = document.createElement('img');
      img.src = nextImage.src;
    }
  }, [selectedProject, currentProject]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header with time */}
        <div className={styles.header}>
          <div className={styles.time}>{currentTime}</div>
        </div>

        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
            <Image 
              src="/pfp.png" 
              alt="Kendall Wood" 
              width={75} 
              height={75}
              className={styles.profileImg}
            />
          </div>
          <div className={styles.profileInfo}>
            <button 
              ref={nameButtonRef}
              className={styles.name}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Kendall Wood <span className={styles.downArrow}>↓</span>
            </button>
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div ref={dropdownRef} className={styles.dropdown}>
            {dropdownLinks.map((link) => (
              <a
                key={link.name}
                href={link.name === "Resume" ? "#" : link.url}
                onClick={(e) => {
                  if (link.name === "Resume") {
                    e.preventDefault();
                    setShowResume(true);
                    setDropdownOpen(false);
                    setSelectedProject(null);
                  }
                }}
                target={link.name === "Resume" ? undefined : "_blank"}
                rel={link.name === "Resume" ? undefined : "noopener noreferrer"}
                className={styles.dropdownLink}
              >
                {link.name}
              </a>
            ))}
              </div>
            )}
            <a 
              href="https://bfacd.parsons.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.education}
            >
              BFA Communication Design '27 - Parsons School of Design
            </a>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {/* Navigation */}
          <div className={styles.navigation}>
            {portfolioData.map((category) => (
              <div key={category.name} className={styles.categorySection}>
                <button
                  className={styles.categoryName}
                  onClick={() => toggleCategory(category.name)}
                >
                  {category.name}
                </button>
                {expandedCategories.has(category.name) && (
                  <span className={styles.projectsList}>
                    {' '}
                    {category.projects.map((project, index) => {
                      const isSelected = selectedProject?.category === category.name && 
                                        selectedProject?.project === project.name;
                      return (
                        <span key={project.name}>
                          <button
                            className={`${styles.projectItem} ${isSelected ? styles.selected : ''}`}
                            onClick={() => handleProjectClick(category.name, project.name)}
                          >
                            {project.name}
                          </button>
                          {index < category.projects.length - 1 && <span className={styles.separator}> / </span>}
                        </span>
                      );
                    })}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Resume Overlay */}
          {showResume && (
            <div className={styles.resumeOverlay}>
              <div className={styles.resumeView}>
                <button className={styles.closeButton} onClick={() => setShowResume(false)}>
                  ×
                </button>
                <div className={styles.resumeContent}>
                  <div className={styles.resumeSection}>
                    <div className={styles.resumeContact}>
                      <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=00kendallwood@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeContactLink}
                      >
                        00kendallwood@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className={styles.resumeSection}>
                    <div className={styles.resumeItem}>
                      <a 
                        href="https://flip.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeItemTitleLink}
                      >
                        Flip AI
                      </a>
                      <div className={styles.resumeItemSubtitle}>Design Intern</div>
                      <div className={styles.resumeItemDate}>June 2025 - September 2025</div>
                      <br />
                      <div className={styles.resumeItemText}>* Lead Design for Flip brand identity update</div>
                      <div className={styles.resumeItemText}>* Assisting <a href="https://storyisthestrategy.com/" target="_blank" rel="noopener noreferrer" className={styles.resumeInlineLink}>Woden</a> in brand strategy and messaging</div>
                      <div className={styles.resumeItemText}>* Assisting <a href="https://www.8020.inc/" target="_blank" rel="noopener noreferrer" className={styles.resumeInlineLink}>8020 inc</a> in web design & strategy</div>
                    </div>

                    <div className={styles.resumeItem}>
                      <a 
                        href="https://www.albrightknox.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeItemTitleLink}
                      >
                        Buffalo AKG Art Museum
                      </a>
                      <div className={styles.resumeItemSubtitle}>Youth Representative of Buffalo AKG Community Advisory Board</div>
                      <div className={styles.resumeItemDate}>November 2022 - November 2024</div>
                      <br />
                      <div className={styles.resumeItemText}>* Represent all museum visitors below 21 years of age during council meetings to ensure representation of interests and help guide strategic decision-making</div>
                      <div className={styles.resumeItemText}>* Meet with the curative team to provide creative advisement for upcoming exhibitions</div>
                    </div>

                    <div className={styles.resumeItem}>
                      <a 
                        href="https://www.neweracap.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeItemTitleLink}
                      >
                        New Era Cap
                      </a>
                      <div className={styles.resumeItemSubtitle}>Apparel Design Intern</div>
                      <div className={styles.resumeItemDate}>May 2024 - August 2024</div>
                      <br />
                      <div className={styles.resumeItemText}>* Creating original apparel graphics for Lifestyle Injections</div>
                      <div className={styles.resumeItemText}>* Assisting in team design conversions for the MLB, NBA, NFL, and WNBA</div>
                      <div className={styles.resumeItemText}>* Working with platforms such as WGSN to track and predict industry trends</div>
                      <div className={styles.resumeItemText}>* Working with platforms such as PLM, Job Tracker, and Wrike to execute team projects</div>
                    </div>

                    <div className={styles.resumeItem}>
                      <a 
                        href="https://beaufleuvemusicarts.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeItemTitleLink}
                      >
                        Beau Fleuve Music & Arts Festival
                      </a>
                      <div className={styles.resumeItemSubtitle}>Chief Design Advisor</div>
                      <div className={styles.resumeItemDate}>January 2024 - May 2024</div>
                      <br />
                      <div className={styles.resumeItemText}>* Advise all aspects of fashion design</div>
                      <div className={styles.resumeItemText}>* Leading brand expansion and enhancement through refining brand identity</div>
                      <div className={styles.resumeItemText}>* Establishing connections and business with manufacturing services</div>
                      <div className={styles.resumeItemText}>* Provide recommendations and advice regarding artist selection</div>
                    </div>

                    <div className={styles.resumeItem}>
                      <a 
                        href="https://www.romeohunte.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeItemTitleLink}
                      >
                        Romeo Hunte
                      </a>
                      <div className={styles.resumeItemSubtitle}>NYFW '24 Graphic Design & Marketing Advisor</div>
                      <div className={styles.resumeItemDate}>January 2024 - February 2024</div>
                      <br />
                      <div className={styles.resumeItemText}>* Oversee all aspects of digital marketing for FW '24 Denim Collection</div>
                      <div className={styles.resumeItemText}>* Work with external PR team to organize guest list and logistics of marketing</div>
                      <div className={styles.resumeItemText}>* Provide recommendations and advice regarding event planning and artist selection</div>
                    </div>

                    <div className={styles.resumeItem}>
                      <a 
                        href="https://www.facebook.com/TOYRECORDSNYC/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeItemTitleLink}
                      >
                        Toy Records
                      </a>
                      <div className={styles.resumeItemSubtitle}>Marketing Design Consultant</div>
                      <div className={styles.resumeItemDate}>October 2023 - November 2023</div>
                      <br />
                      <div className={styles.resumeItemText}>* Attend marketing status meetings and provide strategic recommendations</div>
                      <div className={styles.resumeItemText}>* Provide design feedback to the graphic designer to assist with design strategy</div>
                      <div className={styles.resumeItemText}>* Provide recommendations and advice regarding event planning and artist selection</div>
                    </div>

                    <div className={styles.resumeItem}>
                      <a 
                        href="https://www.beaufleuve.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeItemTitleLink}
                      >
                        Beau Fleuve Music and Arts Festival
                      </a>
                      <div className={styles.resumeItemSubtitle}>Intern</div>
                      <div className={styles.resumeItemDate}>May 2023 - August 2023</div>
                      <br />
                      <div className={styles.resumeItemText}>* Assisted event and arts curation for an annual musical festival</div>
                      <div className={styles.resumeItemText}>* Oversaw all aspects of retail operations, inventory, and merchandise</div>
                      <div className={styles.resumeItemText}>* Worked with the Head Curator to select and create the artist layout map</div>
                      <div className={styles.resumeItemText}>* Designed t-shirts and a series of hats utilizing Adobe Illustrator and Photoshop</div>
                    </div>

                    <div className={styles.resumeItem}>
                      <a 
                        href="https://www.albrightknox.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeItemTitleLink}
                      >
                        Buffalo AKG Art Museum
                      </a>
                      <div className={styles.resumeItemSubtitle}>Museum Ambassador</div>
                      <div className={styles.resumeItemDate}>February 2022 - June 2022</div>
                      <br />
                      <div className={styles.resumeItemText}>* Assisted in community planning and led program event planning</div>
                      <div className={styles.resumeItemText}>* Participated in an intensive curative training focused on event coordination, in-person community engagement, and museum management</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Display */}
          <div className={styles.contentDisplay}>
            {currentImage && selectedProject ? (
              <>
                <div 
                  key={`${selectedProject.category}-${selectedProject.project}-${selectedProject.imageIndex}`}
                  className={styles.imageContainer}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const width = rect.width;
                    if (clickX < width / 2) {
                      navigateImage('prev');
                    } else {
                      navigateImage('next');
                    }
                  }}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
                  }}
                  onTouchEnd={(e) => {
                    if (!touchStartRef.current) return;
                    const touch = e.changedTouches[0];
                    const deltaX = touch.clientX - touchStartRef.current.x;
                    const deltaY = touch.clientY - touchStartRef.current.y;
                    
                    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                      if (deltaX > 0) {
                        navigateImage('prev');
                      } else {
                        navigateImage('next');
                      }
                    }
                    touchStartRef.current = null;
                  }}
                >
                  <div key={`wrapper-${selectedProject.category}-${selectedProject.project}-${selectedProject.imageIndex}`} className={styles.imageWrapper}>
                    {currentImage.src.endsWith('.mp4') || currentImage.src.endsWith('.mov') ? (
                      <video
                        key={`video-${selectedProject.category}-${selectedProject.project}-${selectedProject.imageIndex}`}
                        src={currentImage.src}
                        className={styles.projectImage}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ width: '100%', height: 'auto' }}
                        onLoadedData={() => setImageLoaded(true)}
                      />
                    ) : currentImage.src.endsWith('.pdf') ? (
                      <iframe
                        key={`pdf-${selectedProject.category}-${selectedProject.project}-${selectedProject.imageIndex}`}
                        src={currentImage.src}
                        className={styles.projectImage}
                        style={{ width: '100%', height: '600px', border: 'none' }}
                      />
                    ) : (
                      <img
                        key={`img-${selectedProject.category}-${selectedProject.project}-${selectedProject.imageIndex}`}
                        src={currentImage.src}
                        alt={currentImage.title}
                        className={styles.projectImage}
                        style={{ 
                          width: '100%', 
                          height: 'auto', 
                          objectFit: 'contain',
                          opacity: imageLoaded ? 1 : 0,
                          transition: 'opacity 0.3s ease-in-out'
                        }}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="369" height="400"%3E%3Crect width="369" height="400" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Times New Roman" font-size="12" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
                          setImageLoaded(true);
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.imageInfo}>
                  {currentProject && currentProject.images.length > 1 && (
                    <div className={styles.pageCounter}>
                      {selectedProject.imageIndex + 1}
                    </div>
                  )}
                  <div className={styles.imageTitle}>
                    {currentImage.title} / {currentImage.date} / {currentImage.medium}
                  </div>
                  <div className={styles.imageDescription}>
                    {currentImage.description}
                  </div>
                </div>
              </>
            ) : null}
            </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerText}>
            <div className={styles.footerTitle}>Title / Date / Medium</div>
            <div className={styles.footerDescription}>Description</div>
          </div>
          <div className={styles.pageNumber}>1</div>
        </div>
      </div>
    </div>
  );
}

