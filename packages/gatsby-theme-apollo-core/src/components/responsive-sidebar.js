import PropTypes from 'prop-types';
import useKey from 'react-use/lib/useKey';
import {useRef, useState} from 'react';

export default function ResponsiveSidebar(props) {
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

  return props.children({
    sidebarOpen,
    openSidebar,
    onWrapperClick: handleWrapperClick,
    sidebarRef
  });
}

ResponsiveSidebar.propTypes = {
  children: PropTypes.func.isRequired
};
