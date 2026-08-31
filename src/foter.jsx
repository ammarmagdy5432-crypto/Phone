import React, { useState } from 'react';

export default function AppleFooter() {
  // حالة فتح وإغلاق القوائم للموبايل
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const footerData = [
    {
      title: "Shop and Learn",
      links: ["Store", "Mac", "iPad", "iPhone", "Watch", "AirPods", "TV & Home", "AirTag", "Accessories", "Gift Cards"]
    },
    {
      title: "Apple Wallet",
      links: ["Wallet", "Apple Card", "Apple Pay", "Apple Cash"]
    },
    {
      title: "Account",
      links: ["Manage Your Apple Account", "Apple Store Account", "iCloud.com"]
    },
    {
      title: "Entertainment",
      links: ["Apple TV+", "Apple Music", "Apple Arcade", "Apple Fitness+", "Apple News+", "Apple Podcasts", "Apple Books", "App Store"]
    },
    {
      title: "Apple Store",
      links: ["Find a Store", "Genius Bar", "Today at Apple", "Group Reservations", "Apple Camp", "Apple Trade In", "Ways to Buy", "Recycling Programme", "Order Status", "Shopping Help"]
    },
    {
      title: "For Business",
      links: ["Apple and Business", "Shop for Business"]
    },
    {
      title: "For Education",
      links: ["Apple and Education", "Shop for K-12", "Shop for College"]
    },
    {
      title: "For Healthcare",
      links: ["Apple in Healthcare", "Mac in Healthcare", "Health on Apple Watch"]
    },
    {
      title: "Apple Values",
      links: ["Accessibility", "Education", "Environment", "Inclusion and Diversity", "Privacy", "Racial Equity and Justice", "Supply Chain"]
    },
    {
      title: "About Apple",
      links: ["Newsroom", "Apple Leadership", "Career Opportunities", "Investors", "Ethics & Compliance", "Events", "Contact Apple"]
    }
  ];

  return (
    <footer className="apple-footer">
      <div className="footer-container">
        
        {/* 1. قسم الملاحظات والشروط (Disclaimers) */}
        <section className="footer-disclaimer">
          <p>1. Trade-in values will vary based on the condition, year, and configuration of your eligible trade-in device. Not all devices are eligible for credit. You must be at least 18 years old to be eligible to trade in for credit or for an Apple Gift Card.</p>
          <p>2. Apple Card Monthly Installments (ACMI) is a 0% APR payment option that is only available if you select it at checkout in the U.S. for eligible products purchased at Apple Store locations.</p>
          <p>To access and use all Apple Card features and products available only to Apple Card users, you must add Apple Card to Wallet on an iPhone or iPad with the latest version of iOS or iPadOS.</p>
        </section>

        <div className="footer-separator"></div>

        {/* 2. الروابط القائمة الموزعة (Navigation Links) */}
        <nav className="footer-directory">
          {footerData.map((section, idx) => (
            <div key={idx} className={`directory-col ${openSections[idx] ? 'is-open' : ''}`}>
              <h3 className="col-title" onClick={() => toggleSection(idx)}>
                <span>{section.title}</span>
                <span className="mobile-chevron">+</span>
              </h3>
              <ul className="col-links">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* 3. رابط العثور على متجر والشراء */}
        <section className="footer-buy-info">
          More ways to shop: <a href="#">Find an Apple Store</a> or <a href="#">other retailer</a> near you. Or call 1-800-MY-APPLE.
        </section>

        <div className="footer-separator"></div>

        {/* 4. حقوق النشر والروابط القانونية النهائية */}
        <section className="footer-legal">
          <div className="legal-copyright">
            Copyright © {new Date().getFullYear()} Apple Inc. All rights reserved.
          </div>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Sales Policy</a>
            <a href="#">Legal</a>
            <a href="#">Site Map</a>
          </div>
          <div className="legal-locale">
            <a href="#">United States</a>
          </div>
        </section>

      </div>
    </footer>
  );
}