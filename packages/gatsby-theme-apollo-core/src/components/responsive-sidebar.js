import PropTypes from 'prop-types';
import useKey from 'react-use/lib/useKey';
import {useRef, useState} from 'react';

export function useResponsiveSidebar() {
  const sidebarRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useKey(
    event =>
      sidebarOpen &&
      (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27),
    closeSidebar
  );

  function handleWrapperClick() {
    if (sidebarOpen && !sidebarRef.current.contains(event.target)) {
      closeSidebar();
    }
  }

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return {
    sidebarOpen,
    openSidebar,
    handleWrapperClick,
    sidebarRef
  };
}

export default function ResponsiveSidebar(props) {
  const state = useResponsiveSidebar();
  return props.children(state);
}

ResponsiveSidebar.propTypes = {
  children: PropTypes.func.isRequired
};
