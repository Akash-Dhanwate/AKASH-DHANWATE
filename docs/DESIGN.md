# Design system — minimal glass revision

See [the revision record](./MINIMAL-REVISION.md) for implementation and verification.

The composition is a compact identity poster, three linked project cards, twelve glass technology marks, and a quiet closing signature. The long editorial sections and standalone typing strip have been removed from the displayed README.

| Role | Treatment |
| --- | --- |
| Canvas | Midnight `#080B14` |
| Surfaces | Translucent-looking gradients over controlled dark backgrounds |
| Highlights | Pale violet `#B39AFF` and ice cyan `#88E8E0` |
| Type | Space Grotesk paths in assets; native GitHub text in Markdown |
| Depth | Beveled glass AD panel, shaded spheres, isometric project motifs, embossed logo tiles |
| Motion | One edge light in the hero; one in each project card; no animated logo wall or typing strip |
| Mobile | Dedicated hero/card compositions, naturally wrapping logo tiles |
| Accessibility | Meaningful alt text, real links, explicit static alternatives, reduced-motion media queries |

The glass effect is built from SVG gradients, reflections, shaded edges, and soft shadows. It does not rely on backdrop CSS that GitHub strips. The dimensional motifs are illustrative, rather than functional 3D controls or live data.

The AD letterform remains the signature. All project cards link directly to the repositories verified in the original implementation. The GitHub Metrics demo has a separate real text link.

The frontend skill informed the restrained typography, short copy, and single purpose per section. The user's explicit request for project cards determines that layout choice.

Official technology mark geometry comes from Simple Icons, distributed as a locked development dependency under CC0-1.0. Space Grotesk is licensed under the included SIL OFL. Tools indicate exposure and practice; PyTorch is identified as learning.

No image, badge, typing, or statistics service is required to render the identity. npm packages are development dependencies only. GitHub hosts the assets and repository links; LinkedIn, X, email, and the project demo are optional clicked destinations. The existing contribution generator remains unchanged.

The former dense design files are retained as legacy assets; only the new selected files are referenced by the minimal README.
