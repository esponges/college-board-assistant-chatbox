// import { useEffect, useRef } from 'react';
// // must import like this - https://github.com/KaTeX/KaTeX/issues/1927#issuecomment-485294236
// import renderMathInElement from 'katex/dist/contrib/auto-render.js';

// export const useKatex = () => {
//   // katex render ref
//   const mathRef = useRef(null);

//   useEffect(() => {
//     // this could also be applied to the entire App (_app.js) with the Component as dependency
//     // and document.body instead of the ref
//     // https://codesandbox.io/s/elegant-benz-9d9pt?file=/pages/_app.js:35-140
//     if (mathRef.current) {
//       renderMathInElement(mathRef.current, {
//         delimiters: [
//           { left: '$$', right: '$$', display: true },
//           { left: '$', right: '$', display: false },
//           { left: '\\(', right: '\\)', display: false },
//           { left: '\\[', right: '\\]', display: true },
//         ],
//         throwOnError: false,
//       });
//     }
//   }, [mathRef]);

//   // dont forget importing the .css in the component
//   // like — import 'katex/dist/katex.min.css';
//   return mathRef;
// };
