import { useToasts } from '~/store/toasts'

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  autoClose: boolean;
  duration: number;
  icon: boolean;
}

export type CreateNotification = {
  (options: {
    type?: string;
    title?: string;
    message?: string;
    autoClose?: boolean;
    duration?: number;
    icon?: boolean;
  }): void;
};

const defaultNotificationOptions = {
  type: "info",
  title: "Info Notification",
  message:
    "Ooops! A message was not provided.",
  autoClose: true,
  duration: 5,
  icon: false
};

function createUUID(): string {
  let dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

export default function useNotifications() {
  const store = useToasts()
  // Reactive array of notifications.
  const notifications = store.notifications

  // function to create notification
  const createNotification: CreateNotification = (options) => {
    const _options = Object.assign({ ...defaultNotificationOptions }, options);

    notifications.push(
      ...[
        {
          id: createUUID(),
          ..._options,
        },
      ]
    );
  };

  // function to remove notification
  const removeNotifications = (id: string) => {
    const index = notifications.findIndex((item) => item.id === id);
    if (index !== -1) notifications.splice(index, 1);
  };

  // The two functions below are more for body
  // overflow when creating notifications that slide
  // in from outside the viewport. We will not be
  // using them for now but good to have.
  const stopBodyOverflow = () => {
    document && document.body.classList.add(...["overflow-hidden"]);
  };

  const allowBodyOverflow = () => {
    document && document.body.classList.remove(...["overflow-hidden"]);
  };

  // You need this to ensure we can use the
  // composition function.
  return {
    notifications,
    createNotification,
    removeNotifications,
    stopBodyOverflow,
    allowBodyOverflow,
  };

}
