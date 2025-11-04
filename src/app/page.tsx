"use client";

import React, { useState } from "react";
import HomeIcon from '../../public/svg/home.svg';
import NewsIcon from '../../public/svg/news.svg';
import PortfolioIcon from '../../public/svg/portfolio.svg';
import { FloatingBar } from "./Components/floatingbar";
import HomeSection from "./MainViews/homeSection"
import PortfolioSection from "./MainViews/portfolioSection"
import NewsSection from "./MainViews/newsSection"


export default function Home() {
  const [targets, setTargets] = useState([
    { id: 1, name: "Home", isSelected: true, icon: <HomeIcon className="w-5 h-5" /> },
    { id: 2, name: "Portfolio", isSelected: false, icon: <PortfolioIcon className="w-5 h-5" /> },
    { id: 3, name: "News", isSelected: false, icon: <NewsIcon className="w-5 h-5" /> },
  ]);

  const active = targets.find((t) => t.isSelected)?.name ?? "Home";

  return (
    <main className="flex items-top justify-center min-h-screen bg-background">
      <FloatingBar targets={targets} setTargets={setTargets} />

      {active === "Home" && <HomeSection />}
      {active === "Portfolio" && <PortfolioSection />}
      {active === "News" && <NewsSection />}
    </main>
  );
}
