const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    const element = document.documentElement; 
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen)
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen)
      element.msRequestFullscreen();
    }


    export default toggleFullscreen;