declare module "web-push" {
  interface VapidDetails {
    subject: string;
    publicKey: string;
    privateKey: string;
  }

  interface SendOptions {
    TTL?: number;
    headers?: Record<string, string>;
  }

  function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string
  ): void;

  function sendNotification(
    subscription: PushSubscription,
    payload?: string | Buffer,
    options?: SendOptions
  ): Promise<void>;

  const webPush: {
    setVapidDetails: typeof setVapidDetails;
    sendNotification: typeof sendNotification;
  };

  export default webPush;
}
