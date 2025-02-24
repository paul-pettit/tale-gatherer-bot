import { isValidElement } from "react";
import { ReactNode, useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

interface ConvexClientProviderProps {
  children: ReactNode;
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  const [convex, setConvex] = useState<ConvexReactClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initConvex = async () => {
      const client = new ConvexReactClient(
        import.meta.env.VITE_CONVEX_URL!
      );
      setConvex(client);
      setIsLoading(false);
    };

    initConvex();
  }, []);

  if (isLoading || !convex) {
    return <div>Loading...</div>;
  }

  if (!isValidElement(children)) {
    console.error("Invalid children passed to ConvexClientProvider:", children);
    return <div>Error: Invalid children</div>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}