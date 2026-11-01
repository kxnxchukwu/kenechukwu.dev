import { Fragment } from 'react';

// Lets long identifiers in titles, like appNavigate_DO_NOT_USE_…, wrap after
// each underscore instead of overflowing. <wbr> adds no text, so copying the
// title or reading it with a screen reader is unchanged.
export function softBreaks(text: string) {
  return text.split('_').map((part, index, parts) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 && (
        <>
          _<wbr />
        </>
      )}
    </Fragment>
  ));
}
