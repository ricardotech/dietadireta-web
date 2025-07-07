"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default Providers;
