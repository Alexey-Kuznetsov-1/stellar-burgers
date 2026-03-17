export const socketMiddleware =
  (wsActions: {
    connect: string;
    disconnect: string;
    onOpen: string;
    onClose: string;
    onError: string;
    onMessage: string;
  }) =>
  (store: { dispatch: (action: any) => void }) => {
    let socket: WebSocket | null = null;
    let isConnected = false;
    let reconnectTimer = 0;
    let url = '';

    return (next: (action: any) => void) => (action: any) => {
      const { dispatch } = store;
      const { type, payload } = action;

      if (type === wsActions.connect) {
        url = payload;
        socket = new WebSocket(url);
        isConnected = true;

        socket.onopen = () => {
          dispatch({ type: wsActions.onOpen });
        };

        socket.onerror = () => {
          dispatch({ type: wsActions.onError, payload: 'WebSocket error' });
        };

        socket.onmessage = (event) => {
          const { data } = event;
          const parsedData = JSON.parse(data);
          dispatch({ type: wsActions.onMessage, payload: parsedData });
        };

        socket.onclose = (event) => {
          if (event.code !== 1000) {
            dispatch({
              type: wsActions.onError,
              payload: `WebSocket closed with code: ${event.code}`
            });
          }
          dispatch({ type: wsActions.onClose });

          if (isConnected) {
            reconnectTimer = window.setTimeout(() => {
              dispatch({ type: wsActions.connect, payload: url });
            }, 3000);
          }
        };
      }

      if (type === wsActions.disconnect) {
        isConnected = false;
        clearTimeout(reconnectTimer);
        if (socket) {
          socket.close();
          socket = null;
        }
        dispatch({ type: wsActions.onClose });
      }

      next(action);
    };
  };
