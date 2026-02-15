"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ForceRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/campaign-ends") {
      router.replace("/campaign-ends");
    }
  }, [pathname, router]);

  return null;
}
