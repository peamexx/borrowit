import { getUniqueKey } from "@utils/utils";
import { createContext, useContext, useEffect, useState } from "react";

export interface PluginType {
  name: string;
  event: string;
  component: any;
}

export interface PluginPropsType {
  id: string;
  name: string;
  data?: any;
  onFail?: (message: string) => void;
}

interface OpenPropsType {
  plugin: PluginType;
  key: string | number;
  data?: any;
  onFail?: (message: string) => void;
}

interface OpenPluginsType {
  propsPlugins: PluginType[] | undefined;
  eventName: PluginType['name'];
  configs: { name: PluginType['name'], data: activePluginType['data'] }[];
}

interface activePluginType {
  plugin: PluginType;
  id: string;
  data?: any;
  onFail?: (message: string) => void;
}

interface PendingType {
  id: string;
  res: (value: boolean) => void;
}

interface PluginManagerContextType {
  openPlugins: (propsPlugins: OpenPluginsType['propsPlugins'], eventName: OpenPluginsType['eventName'], configs: OpenPluginsType['configs']) => Promise<void>;
  closePlugin: (id: activePluginType['id']) => void;
  closePluginsByName: (name: PluginType['name']) => void;
}

const PluginManagerContext = createContext<PluginManagerContextType>({
  openPlugins: async () => new Promise(() => { }),
  closePlugin: () => { },
  closePluginsByName: () => { },
});

export function PluginManagerProvider({ children }: any) {
  const [activePlugin, setActivePlugin] = useState<activePluginType[]>([]);
  const [pendingOpen, setPendingOpen] = useState<PendingType | null>(null);

  useEffect(() => {
    if (pendingOpen) {
      const isRegistered = activePlugin.some((p) => p.id === pendingOpen.id);
      if (isRegistered) {
        pendingOpen.res(true);
        setPendingOpen(null);
      }
    }
    console.debug('activePlugin: ', activePlugin);
  }, [activePlugin, pendingOpen]);

  const openPlugins = async (propsPlugins: OpenPluginsType['propsPlugins'], eventName: OpenPluginsType['eventName'], configs: OpenPluginsType['configs']) => {
    if (!propsPlugins || propsPlugins.length === 0) return;

    await Promise.all(configs.map(async (conf) => {
      const filteredPlugin = propsPlugins?.find((plug: PluginType) => plug.event === eventName && plug.name === conf.name);
      if (filteredPlugin) {
        await _openPlugin({
          plugin: filteredPlugin,
          key: getUniqueKey(),
          data: { ...conf.data }
        });
      }
    }));
  }

  const closePlugin = (id: activePluginType['id']) => {
    const _p = activePlugin.filter((actPlug) => actPlug.id !== id);
    setActivePlugin(_p);
  };

  const closePluginsByName = (name: PluginType['name']) => {
    if (activePlugin.length === 0) return;

    const _p = activePlugin.filter((actPlug) => actPlug.plugin.name !== name);
    setActivePlugin(_p);
  };

  const _openPlugin = async (props: OpenPropsType) => {
    return new Promise((res) => {
      const newName = props.plugin.name + '-' + props.key.toString();

      setActivePlugin((prev) => {
        if (prev.length === 0) {
          // 아무 것도 없으면 바로 집어넣기.
          return [{ plugin: props.plugin, id: newName, data: props.data, onFail: props.onFail }];
        }

        // 특정한 플러그인은 사전작업이 필요함. 작업 후 새로운 플러그인 배열 받음.
        const newPrev = _getNewActivePlugin(props.plugin.name, prev);

        // todo 없어도 될 것같아서 일단 주석 처리. 나중에 확인 필요.
        // const existingPlugin = newPrev.filter((p) => p.plugin.name === newName);
        // if (existingPlugin.length !== 0) {
        //   res(true);
        //   return newPrev;
        // }

        return newPrev.concat([{ plugin: props.plugin, id: newName, data: props.data, onFail: props.onFail }]);
      });
      setPendingOpen({ id: newName, res: res });
    })
  };

  const _getNewActivePlugin = (name: PluginType['name'], currentActivePlugin: activePluginType[]) => {
    switch (name) {
      case 'hover-preview':
        // 이 플러그인은 하나만 존재해야함.
        return currentActivePlugin.filter((plug) => plug.plugin.name !== name);
    }
    return currentActivePlugin;
  };

  return (
    <PluginManagerContext.Provider value={{ openPlugins, closePlugin, closePluginsByName }}>
      {children}
      {activePlugin && activePlugin?.map((actPlug) => {
        const PluginComponent = actPlug.plugin.component;
        return <PluginComponent key={actPlug.id} id={actPlug.id} name={actPlug.plugin.name} data={actPlug.data} onFail={actPlug.onFail} />;
      })}
    </PluginManagerContext.Provider>
  );
}

export function usePluginManager() {
  return useContext(PluginManagerContext);
}