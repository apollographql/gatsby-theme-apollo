import PropTypes from 'prop-types';
import useKey from 'react-use/lib/useKey';
import {useState} from 'react';

export function useResponsiveSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useKey(
    event =>
      sidebarOpen &&
      (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27),
    closeSidebar
  );

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return {
    sidebarOpen,
    openSidebar,
    closeSidebar
  };
}

export default function ResponsiveSidebar(props) {
  const state = useResponsiveSidebar();
  return props.children(state);
}

ResponsiveSidebar.propTypes = {
  children: PropTypes.func.isRequired
};
