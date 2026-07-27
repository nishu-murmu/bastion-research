import React, { useEffect, useState } from "react";

const REMOVAL_TIME = new Date("2026-08-01T18:30:00+05:30").getTime(); // Saturday, August 1, 2026 at 6:30 PM IST

const WebinarImagePopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const now = Date.now();

        // Disable popup if cutoff time (Saturday 6:30 PM IST) has passed
        if (now >= REMOVAL_TIME) {
            return;
        }

        // Show popup on page refresh / load
        setIsOpen(true);

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 150);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
            .br-img-popup-overlay {
              position: fixed;
              inset: 0;
              z-index: 99999;
              display: grid;
              place-items: center;
              padding: 16px;
              background: rgba(10, 15, 30, 0.78);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              opacity: 0;
              transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .br-img-popup-overlay.is-visible {
              opacity: 1;
            }

            .br-img-popup-modal {
              position: relative;
              width: 100%;
              max-width: 620px;
              background: #ffffff;
              border-radius: 24px;
              box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.45);
              overflow: hidden;
              transform: scale(0.94) translateY(12px);
              transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .br-img-popup-overlay.is-visible .br-img-popup-modal {
              transform: scale(1) translateY(0);
            }

            .br-img-popup-close {
              position: absolute;
              top: 14px;
              right: 14px;
              z-index: 30;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 36px;
              height: 36px;
              padding: 0;
              border: none;
              border-radius: 50%;
              background: rgba(11, 28, 61, 0.85);
              color: #ffffff;
              font-size: 24px;
              line-height: 1;
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            }
            .br-img-popup-close:hover {
              background: #8b0029;
              transform: rotate(90deg) scale(1.08);
            }

            .br-poster-img-container {
              position: relative;
              width: 100%;
              line-height: 0;
            }

            .br-poster-img {
              display: block;
              width: 100%;
              height: auto;
              max-height: 85vh;
              object-fit: contain;
              border-radius: 24px;
              user-select: none;
              -webkit-user-drag: none;
            }

            /* Clickable CTA Overlay Button - Subtle color fill with downward drop shadow */
            .br-overlay-btn {
              position: absolute;
              bottom: 5.8%;
              right: 4.4%;
              width: 33.5%;
              height: 10.8%;
              border-radius: 20px;
              background: rgba(139, 0, 41, 0.08);
              border: 1px solid rgba(212, 175, 55, 0.35);
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35), 0 2px 6px rgba(139, 0, 41, 0.15);
              cursor: pointer;
              transition: all 0.25s ease;
              z-index: 17;
              text-decoration: none;
            }

            .br-overlay-btn:hover {
              background: rgba(139, 0, 41, 0.18);
              border-color: rgba(255, 215, 0, 0.7);
              box-shadow: 0 8px 22px rgba(0, 0, 0, 0.42), 0 0 16px rgba(212, 175, 55, 0.45);
              transform: translateY(-1px);
            }

            .sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border: 0;
            }
          `,
                }}
            />

            <section
                id="brWebinarImagePopup"
                className={`br-img-popup-overlay ${isVisible ? "is-visible" : ""}`}
                aria-hidden={!isVisible}
                onClick={handleOverlayClick}
            >
                <div
                    className="br-img-popup-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Webinar Image Poster"
                >
                    <button
                        className="br-img-popup-close"
                        type="button"
                        aria-label="Close webinar popup"
                        onClick={handleClose}
                    >
                        &times;
                    </button>

                    <div className="br-poster-img-container">
                        {/* Static non-clickable image */}
                        <img
                            src="/media/webinar-music-industry.jpg"
                            alt="India's Music Industry - Live Webinar Poster"
                            className="br-poster-img"
                        />

                        {/* Only the overlay button is clickable */}
                        <a
                            href="https://payments.cashfree.com/forms/music_industry"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleClose}
                            className="br-overlay-btn"
                            aria-label="Join Webinar"
                        >
                            <span className="sr-only">Join Webinar</span>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default WebinarImagePopup;
