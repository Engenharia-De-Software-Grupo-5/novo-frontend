'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/features/components/ui/breadcrumb';

import { ROUTE_CONFIG } from '@/config/route-config';

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const name = ROUTE_CONFIG[path];

          // Skip if no name configured for this route segment (unless it's the last one, maybe? NO, user wants map)
          // If name is found, render it.
          if (!name) return null;

          return (
            <React.Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbPage className="text-muted-foreground">
                    {name}
                  </BreadcrumbPage>
                  /* Note: Usually non-last items are links, but strictly following 'page' style from Figma for now unless requested to be clickable links. 
                     Figma snapshot shows simple text chain. If navigation needed, swap BreadcrumbPage for BreadcrumbLink.
                     Given standard dashboard patterns, intermediate items usually aren't clickable filters often, but let's stick to text for now.
                  */
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
