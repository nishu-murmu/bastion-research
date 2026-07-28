// import React, { useEffect, useState } from "react";

// const REMOVAL_TIME = new Date("2026-08-01T18:30:00+05:30").getTime(); // Saturday, August 1, 2026 at 6:30 PM IST

// const WebinarPopup: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const now = Date.now();

//     // Disable popup if expiry date/time (Saturday 6:30 PM) has passed
//     if (now >= REMOVAL_TIME) {
//       return;
//     }

//     // Show popup on page refresh / load
//     setIsOpen(true);

//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 150);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleClose = () => {
//     setIsVisible(false);
//     setTimeout(() => {
//       setIsOpen(false);
//     }, 300);
//   };

//   const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) {
//       handleClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//             @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//             .br-webinar-overlay {
//               position: fixed;
//               inset: 0;
//               z-index: 99999;
//               display: grid;
//               place-items: center;
//               padding: 16px;
//               background: rgba(10, 15, 30, 0.78);
//               backdrop-filter: blur(8px);
//               -webkit-backdrop-filter: blur(8px);
//               opacity: 0;
//               transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
//               font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
//             }
//             .br-webinar-overlay.is-visible {
//               opacity: 1;
//             }

//             .br-webinar-modal {
//               position: relative;
//               width: 100%;
//               max-width: 710px;
//               background: #ffffff;
//               border-radius: 28px;
//               box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.08);
//               overflow: hidden;
//               transform: scale(0.95) translateY(12px);
//               transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
//             }
//             .br-webinar-overlay.is-visible .br-webinar-modal {
//               transform: scale(1) translateY(0);
//             }

//             .br-webinar-close {
//               position: absolute;
//               top: 16px;
//               right: 16px;
//               z-index: 20;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               width: 34px;
//               height: 34px;
//               padding: 0;
//               border: 1px solid #e2e8f0;
//               border-radius: 50%;
//               background: #ffffff;
//               color: #475569;
//               font-size: 22px;
//               line-height: 1;
//               cursor: pointer;
//               transition: all 0.2s ease;
//               box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//             }
//             .br-webinar-close:hover {
//               background: #8b0029;
//               color: #ffffff;
//               border-color: #8b0029;
//               transform: rotate(90deg);
//             }

//             .br-poster-container {
//               position: relative;
//               background: #ffffff;
//               padding: 30px 28px 26px;
//               display: flex;
//               flex-direction: column;
//             }

//             .br-poster-header {
//               display: flex;
//               align-items: center;
//               justify-content: space-between;
//               margin-bottom: 12px;
//             }

//             .br-live-tag {
//               display: inline-flex;
//               align-items: center;
//               gap: 6px;
//               padding: 5px 14px;
//               border: 1.5px solid #0b1c3d;
//               border-radius: 20px;
//               font-family: 'Outfit', sans-serif;
//               font-size: 11px;
//               font-weight: 800;
//               letter-spacing: 0.08em;
//               color: #0b1c3d;
//               text-transform: uppercase;
//               background: #ffffff;
//             }
//             .br-live-dot {
//               width: 8px;
//               height: 8px;
//               border-radius: 50%;
//               background: #d1112a;
//               animation: br-pulse 1.8s infinite;
//             }
//             @keyframes br-pulse {
//               0% { opacity: 1; transform: scale(1); }
//               50% { opacity: 0.35; transform: scale(0.85); }
//               100% { opacity: 1; transform: scale(1); }
//             }

//             /* Header Logo with increased size and shifted left */
//             .br-brand-logo {
//               height: 54px;
//               width: auto;
//               object-fit: contain;
//               transform: translateX(-12px);
//               margin-right: 18px;
//             }

//             /* Main Layout Grid */
//             .br-poster-body {
//               display: grid;
//               grid-template-columns: 1fr 270px;
//               gap: 16px;
//               position: relative;
//               margin-bottom: 18px;
//             }

//             .br-title-section {
//               margin-bottom: 0;
//             }

//             .br-title-main {
//               font-family: 'Outfit', sans-serif;
//               line-height: 1.15;
//               letter-spacing: -0.02em;
//               margin: 0;
//             }
//             .br-title-navy {
//               font-size: clamp(34px, 4.4vw, 44px);
//               font-weight: 800;
//               color: #0b1c3d;
//               display: block;
//             }
//             .br-title-maroon {
//               font-size: clamp(33px, 4.3vw, 43px);
//               font-weight: 800;
//               color: #8b0029;
//               display: block;
//             }

//             /* Golden Divider placed directly below main title */
//             .br-divider {
//               display: flex;
//               align-items: center;
//               gap: 8px;
//               margin: 12px 0 12px;
//             }
//             .br-divider-line {
//               flex: 1;
//               height: 1.5px;
//               background: linear-gradient(90deg, rgba(212, 175, 55, 0.2) 0%, #d4af37 50%, rgba(212, 175, 55, 0.2) 100%);
//             }
//             .br-divider-dot {
//               width: 7px;
//               height: 7px;
//               border-radius: 50%;
//               background: #d4af37;
//             }

//             .br-subtitle-main {
//               font-family: 'Outfit', sans-serif;
//               font-size: clamp(17px, 2.2vw, 21px);
//               font-weight: 700;
//               line-height: 1.3;
//               letter-spacing: -0.01em;
//               margin-bottom: 14px;
//             }
//             .br-sub-navy {
//               color: #0b1c3d;
//               display: block;
//             }
//             .br-sub-maroon {
//               color: #8b0029;
//               display: block;
//             }

//             .br-info-box {
//               padding-left: 12px;
//               border-left: 3.5px solid #8b0029;
//               font-size: 13.5px;
//               color: #334155;
//               line-height: 1.48;
//               margin-bottom: 14px;
//             }
//             .br-info-box strong {
//               color: #0b1c3d;
//               font-weight: 700;
//             }

//             .br-bullet-box {
//               display: flex;
//               align-items: flex-start;
//               gap: 9px;
//               font-size: 13px;
//               color: #334155;
//               line-height: 1.48;
//               margin-bottom: 16px;
//             }
//             .br-note-icon {
//               font-size: 18px;
//               color: #8b0029;
//               line-height: 1;
//               margin-top: 1px;
//             }
//             .br-bullet-box strong {
//               color: #0b1c3d;
//               font-weight: 700;
//             }

//             .br-featuring-badge {
//               display: inline-flex;
//               align-items: center;
//               gap: 7px;
//               padding: 6px 16px;
//               border: 1.5px solid #d4af37;
//               border-radius: 30px;
//               background: #fffdf5;
//               font-family: 'Outfit', sans-serif;
//               font-size: 12px;
//               color: #8b0029;
//               font-weight: 500;
//             }
//             .br-featuring-badge strong {
//               color: #0b1c3d;
//               font-weight: 600;
//             }

//             /* Right Graphic Illustration Section */
//             .br-graphic-container {
//               position: relative;
//               min-height: 290px;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//             }

//             /* Floating Gold & Crimson Music Notes */
//             .br-floating-note {
//               position: absolute;
//               opacity: 0.9;
//               animation: br-float 3s ease-in-out infinite alternate;
//               z-index: 6;
//               filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
//             }
//             @keyframes br-float {
//               0% { transform: translateY(0) rotate(0deg); }
//               100% { transform: translateY(-10px) rotate(10deg); }
//             }

//             /* Equalizer Sound Waves in Background */
//             .br-eq-bg {
//               position: absolute;
//               right: 12px;
//               bottom: 15px;
//               top: 15px;
//               width: 140px;
//               display: flex;
//               align-items: flex-end;
//               gap: 3px;
//               opacity: 0.32;
//               pointer-events: none;
//               z-index: 1;
//             }
//             .br-eq-bar {
//               flex: 1;
//               background: linear-gradient(180deg, #ff3348 0%, #8b0029 100%);
//               border-radius: 3px 3px 0 0;
//               animation: br-eq-anim 1.4s ease-in-out infinite alternate;
//             }
//             @keyframes br-eq-anim {
//               0% { height: 15%; }
//               100% { height: 95%; }
//             }

//             /* Phone Mockup matching Image Artwork */
//             .br-phone-frame {
//               position: relative;
//               z-index: 4;
//               width: 150px;
//               background: #090d16;
//               border: 3px solid #1e293b;
//               border-radius: 26px;
//               padding: 6px;
//               box-shadow: 0 22px 45px rgba(0, 0, 0, 0.38);
//               transform: rotate(-3deg);
//             }

//             .br-phone-content {
//               background: radial-gradient(circle at center, #1b0a2a 0%, #090d16 100%);
//               border-radius: 20px;
//               padding: 12px 9px 14px;
//               text-align: center;
//               color: #ffffff;
//             }

//             .br-phone-topbar {
//               display: flex;
//               align-items: center;
//               justify-content: space-between;
//               font-size: 7.5px;
//               color: #94a3b8;
//               margin-bottom: 6px;
//             }

//             /* Singer Silhouette Spotlight Cover Art */
//             .br-phone-cover {
//               position: relative;
//               width: 62px;
//               height: 62px;
//               margin: 4px auto 6px;
//               border-radius: 50%;
//               overflow: hidden;
//               background: radial-gradient(circle, #e11d48 0%, #4c0519 100%);
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               box-shadow: 0 4px 16px rgba(225, 29, 72, 0.5);
//               border: 1px solid rgba(255, 255, 255, 0.2);
//             }

//             .br-phone-title {
//               font-family: 'Outfit', sans-serif;
//               font-size: 11px;
//               font-weight: 700;
//               margin-bottom: 1px;
//               color: #ffffff;
//             }
//             .br-phone-sub {
//               font-size: 8px;
//               color: #cbd5e1;
//               margin-bottom: 8px;
//             }

//             .br-phone-scrubber-wrap {
//               display: flex;
//               align-items: center;
//               justify-content: space-between;
//               font-size: 6.5px;
//               color: #94a3b8;
//               margin-bottom: 6px;
//             }
//             .br-phone-scrubber {
//               flex: 1;
//               height: 3px;
//               background: #334155;
//               border-radius: 2px;
//               position: relative;
//               margin: 0 4px;
//             }
//             .br-phone-scrub-fill {
//               width: 45%;
//               height: 100%;
//               background: #e11d48;
//             }
//             .br-phone-scrub-dot {
//               position: absolute;
//               left: 45%;
//               top: -2.5px;
//               width: 8px;
//               height: 8px;
//               border-radius: 50%;
//               background: #ffffff;
//               box-shadow: 0 0 6px rgba(225, 29, 72, 0.9);
//             }

//             .br-phone-controls {
//               display: flex;
//               align-items: center;
//               justify-content: space-between;
//               padding: 0 6px;
//               color: #cbd5e1;
//             }
//             .br-phone-play-btn {
//               width: 22px;
//               height: 22px;
//               border-radius: 50%;
//               background: #d1112a;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               color: #ffffff;
//               box-shadow: 0 3px 10px rgba(209, 17, 42, 0.6);
//             }

//             /* Black & Metallic Gold Over-Ear Headphones */
//             .br-headphones {
//               position: absolute;
//               bottom: -4px;
//               left: -4px;
//               z-index: 5;
//               display: flex;
//               align-items: center;
//             }
//             .br-headphone-body {
//               position: relative;
//               display: flex;
//               align-items: center;
//             }
//             .br-earcup-left {
//               width: 38px;
//               height: 38px;
//               border-radius: 50%;
//               background: radial-gradient(circle, #1e293b 0%, #0f172a 100%);
//               border: 2.5px solid #d4af37;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               box-shadow: 0 6px 14px rgba(0,0,0,0.4);
//             }
//             .br-earcup-right {
//               width: 42px;
//               height: 42px;
//               border-radius: 50%;
//               background: radial-gradient(circle, #1e293b 0%, #0f172a 100%);
//               border: 3px solid #d4af37;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               box-shadow: 0 6px 16px rgba(0,0,0,0.45);
//               margin-left: -12px;
//               z-index: 2;
//             }
//             .br-earcup-gold-note {
//               color: #ffd700;
//               font-size: 16px;
//               font-weight: bold;
//               filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
//             }

//             /* Metallic Gold 3D Bar Chart & Gold Arrow */
//             .br-chart-3d {
//               position: absolute;
//               bottom: 4px;
//               right: -8px;
//               z-index: 5;
//               display: flex;
//               align-items: flex-end;
//               gap: 4px;
//             }
//             .br-chart-bar {
//               width: 12px;
//               background: linear-gradient(180deg, #fff3b0 0%, #ffd700 45%, #b8860b 100%);
//               border-radius: 2px 2px 0 0;
//               box-shadow: 2px 2px 6px rgba(0,0,0,0.25);
//             }
//             .br-chart-arrow {
//               position: absolute;
//               top: -20px;
//               right: -6px;
//               color: #ffd700;
//               filter: drop-shadow(2px 3px 6px rgba(0,0,0,0.35));
//             }

//             /* 4 Features Row with Matched Border Circles */
//             .br-features-grid {
//               display: grid;
//               grid-template-columns: repeat(4, 1fr);
//               gap: 12px;
//               margin-bottom: 20px;
//               padding: 12px 0;
//               border-top: 1px solid #f1f5f9;
//               border-bottom: 1px solid #f1f5f9;
//             }

//             .br-feature-col {
//               display: flex;
//               align-items: center;
//               gap: 10px;
//               text-align: left;
//               position: relative;
//               padding: 2px 4px;
//             }
//             .br-feature-col:not(:last-child)::after {
//               content: "";
//               position: absolute;
//               right: -6px;
//               top: 10%;
//               bottom: 10%;
//               width: 1px;
//               background: #e2e8f0;
//             }

//             .br-icon-circle {
//               width: 48px;
//               height: 48px;
//               min-width: 48px;
//               border-radius: 50%;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               background: #0b1c3d;
//               color: #ffffff;
//               border: 2px solid #0b1c3d;
//               box-shadow: 0 4px 10px rgba(11, 28, 61, 0.15);
//             }
//             .br-icon-circle.maroon {
//               background: #8b0029;
//               border: 2px solid #8b0029;
//               box-shadow: 0 4px 10px rgba(139, 0, 41, 0.2);
//             }

//             .br-feature-text {
//               display: flex;
//               flex-direction: column;
//             }

//             .br-feature-heading {
//               font-family: 'Outfit', sans-serif;
//               font-size: 13px;
//               font-weight: 800;
//               color: #0b1c3d;
//               line-height: 1.2;
//               margin-bottom: 2px;
//             }

//             .br-feature-subtext {
//               font-size: 10.5px;
//               color: #64748b;
//               line-height: 1.28;
//               font-weight: 500;
//             }

//             /* Footer Bar: Date/Time + CTA Button matching Image */
//             .br-footer-section {
//               display: flex;
//               align-items: center;
//               justify-content: space-between;
//               gap: 14px;
//               padding-top: 4px;
//             }

//             .br-datetime-container {
//               display: flex;
//               align-items: center;
//               gap: 14px;
//               padding: 8px 18px;
//               border: 1.8px solid #d4af37;
//               border-radius: 35px;
//               font-family: 'Outfit', sans-serif;
//               font-size: 15px;
//               font-weight: 800;
//               color: #0b1c3d;
//               background: #ffffff;
//             }

//             .br-dt-badge-navy {
//               width: 32px;
//               height: 32px;
//               border-radius: 50%;
//               background: #0b1c3d;
//               color: #ffffff;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//             }
//             .br-dt-badge-maroon {
//               width: 32px;
//               height: 32px;
//               border-radius: 50%;
//               background: #8b0029;
//               color: #ffffff;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//             }

//             .br-dt-block {
//               display: flex;
//               align-items: center;
//               gap: 8px;
//             }
//             .br-dt-text {
//               color: #0b1c3d;
//             }

//             .br-dt-divider {
//               width: 1.5px;
//               height: 22px;
//               background: #cbd5e1;
//             }

//             .br-btn-join {
//               display: inline-flex;
//               align-items: center;
//               justify-content: center;
//               gap: 8px;
//               padding: 12px 34px;
//               background: linear-gradient(135deg, #8b0029 0%, #5d001b 100%);
//               border: 1.5px solid #d4af37;
//               color: #ffffff;
//               font-family: 'Outfit', sans-serif;
//               font-size: 16.5px;
//               font-weight: 800;
//               letter-spacing: 0.04em;
//               text-transform: uppercase;
//               text-decoration: none;
//               border-radius: 35px;
//               box-shadow: 0 4px 18px rgba(139, 0, 41, 0.45);
//               transition: all 0.25s ease;
//             }
//             .br-btn-join:hover {
//               background: linear-gradient(135deg, #a60031 0%, #750022 100%);
//               transform: translateY(-1.5px);
//               box-shadow: 0 8px 24px rgba(139, 0, 41, 0.55);
//               color: #ffffff;
//             }

//             /* Responsive rules */
//             @media (max-width: 760px) {
//               .br-poster-container {
//                 padding: 20px;
//               }
//               .br-poster-body {
//                 grid-template-columns: 1fr;
//               }
//               .br-graphic-container {
//                 display: none;
//               }
//             }

//             @media (max-width: 640px) {
//               .br-features-grid {
//                 grid-template-columns: repeat(2, 1fr);
//                 gap: 14px;
//               }
//               .br-feature-col:not(:last-child)::after {
//                 display: none;
//               }
//               .br-footer-section {
//                 flex-direction: column;
//                 align-items: stretch;
//               }
//               .br-datetime-container {
//                 justify-content: center;
//                 font-size: 13.5px;
//                 padding: 8px 14px;
//               }
//               .br-btn-join {
//                 width: 100%;
//                 text-align: center;
//               }
//             }
//           `,
//         }}
//       />

//       <section
//         id="brWebinarPopup"
//         className={`br-webinar-overlay ${isVisible ? "is-visible" : ""}`}
//         aria-hidden={!isVisible}
//         onClick={handleOverlayClick}
//       >
//         <div
//           className="br-webinar-modal"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="brWebinarTitle"
//         >
//           <button
//             className="br-webinar-close"
//             type="button"
//             aria-label="Close webinar popup"
//             onClick={handleClose}
//           >
//             &times;
//           </button>

//           <div className="br-poster-container">
//             {/* Header: Live Tag & Larger Shifted-Left Logo */}
//             <div className="br-poster-header">
//               <div className="br-live-tag">
//                 <span className="br-live-dot" />
//                 LIVE WEBINAR
//               </div>
//               <img
//                 src="/media/header-logo.webp"
//                 alt="Bastion Research"
//                 className="br-brand-logo"
//               />
//             </div>

//             {/* Main Poster Body */}
//             <div className="br-poster-body">
//               {/* Left Column: Titles & Details */}
//               <div>
//                 {/* Main Title: India's (line 1, 1px bigger) & Music Industry (line 2) */}
//                 <div className="br-title-section" id="brWebinarTitle">
//                   <div className="br-title-main">
//                     <span className="br-title-navy">India's</span>
//                     <span className="br-title-maroon">Music Industry</span>
//                   </div>
//                 </div>

//                 {/* Golden Dot Divider placed directly below main title */}
//                 <div className="br-divider">
//                   <div className="br-divider-line" />
//                   <div className="br-divider-dot" />
//                   <div className="br-divider-line" />
//                 </div>

//                 {/* Subtitle: Understanding the Business (line 1) & Behind the Music (line 2) */}
//                 <div className="br-subtitle-main">
//                   <span className="br-sub-navy">Understanding the Business</span>
//                   <span className="br-sub-maroon">Behind the Music</span>
//                 </div>

//                 {/* Pitch quote box with line breaks */}
//                 <div className="br-info-box">
//                   India is listening to more music than ever.<br />
//                   <strong>But how does the business behind</strong><br />
//                   <strong>that music actually work?</strong>
//                 </div>

//                 {/* Bullet section */}
//                 <div className="br-bullet-box">
//                   <span className="br-note-icon">♫</span>
//                   <div>
//                     An <strong>investor-focused session</strong> on music IP,<br />
//                     digital monetisation, catalogue value, and<br />
//                     the business models of Saregama India<br />
//                     and Tips Music.
//                   </div>
//                 </div>

//                 {/* Featuring capsule */}
//                 <div className="br-featuring-badge">
//                   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
//                     <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
//                     <line x1="12" y1="19" x2="12" y2="23" />
//                     <line x1="8" y1="23" x2="16" y2="23" />
//                   </svg>
//                   <span>
//                     Featuring: Saregama India • Tips Music
//                   </span>
//                 </div>
//               </div>

//               {/* Right Column: Smartphone, Headphones, Equalizer & 3D Chart matching uploaded image */}
//               <div className="br-graphic-container">
//                 {/* Floating Gold & Red Music Notes */}
//                 <span className="br-floating-note" style={{ top: "4px", right: "12px", color: "#d1112a", fontSize: "20px" }}>♫</span>
//                 <span className="br-floating-note" style={{ top: "36px", right: "45px", color: "#d4af37", fontSize: "18px", animationDelay: "1s" }}>♪</span>
//                 <span className="br-floating-note" style={{ top: "70px", left: "10px", color: "#d4af37", fontSize: "22px", animationDelay: "1.5s" }}>♪</span>

//                 {/* Crimson Equalizer Waveform Bars */}
//                 <div className="br-eq-bg">
//                   <div className="br-eq-bar" style={{ animationDelay: "0.1s" }} />
//                   <div className="br-eq-bar" style={{ animationDelay: "0.4s" }} />
//                   <div className="br-eq-bar" style={{ animationDelay: "0.2s" }} />
//                   <div className="br-eq-bar" style={{ animationDelay: "0.6s" }} />
//                   <div className="br-eq-bar" style={{ animationDelay: "0.3s" }} />
//                   <div className="br-eq-bar" style={{ animationDelay: "0.5s" }} />
//                 </div>

//                 {/* Smartphone Mockup */}
//                 <div className="br-phone-frame">
//                   <div className="br-phone-content">
//                     <div className="br-phone-topbar">
//                       <span>≡</span>
//                       <span>Now Playing</span>
//                       <span>•••</span>
//                     </div>

//                     {/* Singer Silhouette Album Art */}
//                     <div className="br-phone-cover">
//                       <svg width="62" height="62" viewBox="0 0 100 100" fill="none">
//                         <circle cx="50" cy="50" r="48" fill="#a10d29" />
//                         <circle cx="50" cy="40" r="28" fill="#d1112a" opacity="0.8" />
//                         {/* Singer silhouette */}
//                         <path
//                           d="M50 30 C45 30 42 34 42 39 C42 45 46 48 50 48 C54 48 58 45 58 39 C58 34 55 30 50 30 Z M38 68 C38 54 44 50 50 50 C56 50 62 54 62 68 Z"
//                           fill="#090d16"
//                         />
//                         {/* Guitar silhouette */}
//                         <path
//                           d="M32 58 L68 76 M62 73 L66 79 L60 82 L56 76 Z"
//                           stroke="#090d16"
//                           strokeWidth="3.5"
//                           strokeLinecap="round"
//                         />
//                       </svg>
//                     </div>

//                     <div className="br-phone-title">Feel the Music</div>
//                     <div className="br-phone-sub">Every Beat. Every Story.</div>

//                     {/* Scrubber timeline */}
//                     <div className="br-phone-scrubber-wrap">
//                       <span>1:25</span>
//                       <div className="br-phone-scrubber">
//                         <div className="br-phone-scrub-fill" />
//                         <div className="br-phone-scrub-dot" />
//                       </div>
//                       <span>3:45</span>
//                     </div>

//                     {/* Full Music Controls: Shuffle, Prev, Play, Next, Heart */}
//                     <div className="br-phone-controls">
//                       {/* Shuffle */}
//                       <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <polyline points="16 3 21 3 21 8" />
//                         <line x1="4" y1="20" x2="21" y2="3" />
//                         <polyline points="21 16 21 21 16 21" />
//                         <line x1="15" y1="15" x2="21" y2="21" />
//                       </svg>
//                       {/* Prev */}
//                       <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
//                         <polygon points="19 20 9 12 19 4 19 20" />
//                         <line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="2" />
//                       </svg>
//                       {/* Big Red Play Button */}
//                       <div className="br-phone-play-btn">
//                         <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
//                           <polygon points="6 3 20 12 6 21 6 3" />
//                         </svg>
//                       </div>
//                       {/* Next */}
//                       <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
//                         <polygon points="5 4 15 12 5 20 5 4" />
//                         <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="2" />
//                       </svg>
//                       {/* Heart */}
//                       <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Over-Ear Headphones Graphic with Golden Trim & Note */}
//                 <div className="br-headphones">
//                   <div className="br-headphone-body">
//                     <div className="br-earcup-left" />
//                     <div className="br-earcup-right">
//                       <span className="br-earcup-gold-note">♪</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 3D Metallic Gold Bar Chart & Gold Arrow */}
//                 <div className="br-chart-3d">
//                   <svg className="br-chart-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
//                     <polyline points="18 15 23 10 18 5" />
//                     <line x1="23" y1="10" x2="2" y2="22" />
//                   </svg>
//                   <div className="br-chart-bar" style={{ height: "22px" }} />
//                   <div className="br-chart-bar" style={{ height: "35px" }} />
//                   <div className="br-chart-bar" style={{ height: "48px" }} />
//                   <div className="br-chart-bar" style={{ height: "64px" }} />
//                 </div>
//               </div>
//             </div>

//             {/* 4 Feature Items */}
//             <div className="br-features-grid">
//               {/* Item 1: Music IP */}
//               <div className="br-feature-col">
//                 <div className="br-icon-circle">
//                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                     <polyline points="14 2 14 8 20 8" />
//                     <line x1="8" y1="12" x2="11" y2="12" />
//                     <line x1="8" y1="8" x2="10" y2="8" />
//                     <path d="M15 13v4.5" />
//                     <circle cx="13.5" cy="17.5" r="1.5" fill="currentColor" />
//                     <path d="M15 13l3-1v3" />
//                   </svg>
//                 </div>
//                 <div className="br-feature-text">
//                   <div className="br-feature-heading">Music IP</div>
//                   <div className="br-feature-subtext">Own the rights.<br />Own the future.</div>
//                 </div>
//               </div>

//               {/* Item 2: Digital Revenue */}
//               <div className="br-feature-col">
//                 <div className="br-icon-circle maroon">
//                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M4 6h6M4 9.5h6M4 6c3 0 4.5 1.5 4.5 3.5S6.5 13 4 13l5.5 6" />
//                     <rect x="12" y="14" width="2.5" height="5" rx="1" fill="currentColor" stroke="none" />
//                     <rect x="16.5" y="10" width="2.5" height="9" rx="1" fill="currentColor" stroke="none" />
//                     <rect x="21" y="6" width="2.5" height="13" rx="1" fill="currentColor" stroke="none" />
//                   </svg>
//                 </div>
//                 <div className="br-feature-text">
//                   <div className="br-feature-heading">Digital Revenue</div>
//                   <div className="br-feature-subtext">From streams to<br />subscriptions.</div>
//                 </div>
//               </div>

//               {/* Item 3: Catalogue Value */}
//               <div className="br-feature-col">
//                 <div className="br-icon-circle">
//                   <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <circle cx="12" cy="12" r="10" strokeWidth="2" />
//                     <circle cx="12" cy="12" r="7" strokeWidth="1.5" strokeDasharray="3 2" />
//                     <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
//                     <circle cx="12" cy="12" r="2" fill="currentColor" />
//                   </svg>
//                 </div>
//                 <div className="br-feature-text">
//                   <div className="br-feature-heading">Catalogue Value</div>
//                   <div className="br-feature-subtext">Timeless assets.<br />Lasting value.</div>
//                 </div>
//               </div>

//               {/* Item 4: Listed Opportunity */}
//               <div className="br-feature-col">
//                 <div className="br-icon-circle maroon">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <rect x="3" y="14" width="4" height="6" rx="1" fill="currentColor" stroke="none" />
//                     <rect x="9.5" y="10" width="4" height="10" rx="1" fill="currentColor" stroke="none" />
//                     <rect x="16" y="6" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
//                     <path d="M3 12l6-4 6 3 6-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
//                     <polyline points="16 4 21 4 21 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>
//                 </div>
//                 <div className="br-feature-text">
//                   <div className="br-feature-heading">Listed Opportunity</div>
//                   <div className="br-feature-subtext">Discover potential<br />in listed players.</div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer Bar: Date/Time + CTA Button matching Image */}
//             <div className="br-footer-section">
//               <div className="br-datetime-container">
//                 <div className="br-dt-block">
//                   <div className="br-dt-badge-navy">
//                     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                       <line x1="16" y1="2" x2="16" y2="6" />
//                       <line x1="8" y1="2" x2="8" y2="6" />
//                       <line x1="3" y1="10" x2="21" y2="10" />
//                       <circle cx="8" cy="14" r="1" fill="currentColor" />
//                       <circle cx="12" cy="14" r="1" fill="currentColor" />
//                       <circle cx="16" cy="14" r="1" fill="currentColor" />
//                       <circle cx="8" cy="18" r="1" fill="currentColor" />
//                       <circle cx="12" cy="18" r="1" fill="currentColor" />
//                       <circle cx="16" cy="18" r="1" fill="currentColor" />
//                     </svg>
//                   </div>
//                   <span className="br-dt-text">2 August 2026</span>
//                 </div>

//                 <div className="br-dt-divider" />

//                 <div className="br-dt-block">
//                   <div className="br-dt-badge-maroon">
//                     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <circle cx="12" cy="12" r="10" />
//                       <polyline points="12 6 12 12 16 14" />
//                     </svg>
//                   </div>
//                   <span className="br-dt-text">11:30 AM</span>
//                 </div>
//               </div>

//               <a
//                 href="https://payments.cashfree.com/forms/music_industry"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={handleClose}
//                 className="br-btn-join"
//               >
//                 JOIN WEBINAR &gt;
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default WebinarPopup;
