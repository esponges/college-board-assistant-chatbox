import { useEffect, useRef } from 'react';
import katex from 'katex';

export const KaTeXComponent = ({
  texExpression,
}: {
  texExpression: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    katex.render(texExpression, containerRef.current, {
      output: 'mathml',
    });
  }, [texExpression]);

  if (!texExpression) return null;

  return <div ref={containerRef} />;
};
