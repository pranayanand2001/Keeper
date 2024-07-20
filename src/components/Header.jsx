import React, { useState, useEffect } from "react";

function Header() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);
  return (
    <header className={visible ? "visible" : ""}>
      <h1>Keeper</h1>
    </header>
  );
}

export default Header;
