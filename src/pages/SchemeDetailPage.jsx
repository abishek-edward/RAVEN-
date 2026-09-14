import React from 'react';
import { useRaven } from '../context/RavenContext';
import SchemeDetail from '../components/schemes/SchemeDetail';

export default function SchemeDetailPage() {
  const { selectedSchemeId } = useRaven();

  return (
    <div>
      <SchemeDetail schemeId={selectedSchemeId} />
    </div>
  );
}
