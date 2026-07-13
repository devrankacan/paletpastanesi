"use client";

import { useEffect, useRef } from "react";

export function IyzicoCheckoutForm({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = html;

    // Tarayıcılar innerHTML ile eklenen <script> etiketlerini çalıştırmadığı
    // için iyzico'nun checkout form script'ini elle oluşturup yeniden ekliyoruz.
    const scripts = Array.from(container.querySelectorAll("script"));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value),
      );
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    });

    return () => {
      container.innerHTML = "";
    };
  }, [html]);

  return <div ref={containerRef} id="iyzipay-checkout-form" />;
}
