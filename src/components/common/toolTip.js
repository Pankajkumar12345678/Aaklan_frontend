import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const Tooltip = ({ text, children }) => (
  <Tippy content={text} placement="top">
    <span>{children}</span>
  </Tippy>
);

export default Tooltip;