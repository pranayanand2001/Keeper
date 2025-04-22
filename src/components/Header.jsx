import React, { useState, useEffect } from "react";

function Header() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);
  
  return (
    <header className={`header ${visible ? "visible" : ""}`}>
      <div className="header-content">
        <h1>
          <span className="header-icon">📝</span>
          Keeper
        </h1>
      </div>
    </header>
  );
}

export default Header;
