import { createPortal } from "react-dom";
import { useEffect } from "react";

import { usePluginManager, type PluginPropsType, type PluginType } from "@plugins/PluginProvider";

interface Props extends PluginPropsType {
  data: {
    imgSrc: string; // 이미지 경로
    ref: Element; // 해당 element 내부에 이미지용 element가 append 됨.
    [key: string]: any;
  }
}

function ComponentUI(props: Props) {
  const { closePlugin } = usePluginManager();

  if (!props.data.imgSrc || !props.data.ref) {
    props.onFail?.(`Fail to fire Plugin: ${props.name}`);
    return null;
  };

  useEffect(() => {
    function _handleHoverEvent(e: any) {
      if (e.target && !e.target.classList.contains('hover-preview-area')) {
        closePlugin(props.id);
      }
    }
    document.body.addEventListener('mouseover', _handleHoverEvent)

    return () => {
      document.body.removeEventListener('mouseover', _handleHoverEvent);
    }
  }, [])

  return (<>
    {createPortal(<div className="hover-preview-area" style={{
      position: 'absolute',
      top: '-30px',
      left: '30px',
      width: '120px',
      height: '100px',
      backgroundImage: `url(${props.data.imgSrc})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'auto 100px',
      zIndex: 100,
    }} />, props.data.ref)}
  </>)
}

export const HoverPreviewPlugin: PluginType = {
  name: 'hover-preview',
  event: 'hover',
  component: (props: Props) => <ComponentUI {...props} />
}