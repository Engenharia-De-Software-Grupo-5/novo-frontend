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
          const fullPath = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;

          if (segment === 'condominios') return null;

          let name = '';

          const isDashboardRoot = /^\/condominios\/[^/]+$/.test(fullPath);

          if (isDashboardRoot) {
            name = 'Dashboard';
          } else {
            const relativePath = fullPath.replace(/^\/condominios\/[^/]+/, '');

            name = ROUTE_CONFIG[relativePath];
          }
          if (!name) return null;

          return (
            <React.Fragment key={fullPath}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbPage className="text-muted-foreground">
                    {name}
                  </BreadcrumbPage>
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
