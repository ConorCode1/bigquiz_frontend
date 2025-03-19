// StructuredData.js
import React from "react";

function StructuredData() {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Organization",
        url: "https://www.acecraft.ie",
        logo: "https://www.acecraft.ie/rocket.png",
      })}
    </script>
  );
}

export default StructuredData;
