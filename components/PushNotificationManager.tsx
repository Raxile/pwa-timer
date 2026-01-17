'use client'
 
import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from './actions'
 
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}


function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [message, setMessage] = useState('')
 
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])
 
  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }
 
  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }
 
  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }
 
  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }
 
  if (!isSupported) {
    return   <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 9999,
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      padding: "10px 16px",
      textAlign: "center",
      fontSize: "14px",
      fontWeight: 500,
    }}
  >
    Push notifications are not supported in this browser.
  </div>

  }
 return (
  <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
    <div className="w-full max-w-3xl rounded-xl border border-gray-700 bg-[#121212] p-4 shadow-2xl">
      {subscription ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/20 text-green-400">
              🔔
            </div>
            <div>
              <p className="text-sm font-medium text-green-400">
                Notifications enabled
              </p>
              <p className="text-xs text-gray-400">
                You’ll receive important updates
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Test message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="
                w-full sm:w-56 rounded-lg border border-gray-600 bg-[#0f0f0f]
                px-3 py-2 text-sm text-white placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-600
              "
            />

            <button
              onClick={sendTestNotification}
              disabled={!message}
              className="
                rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
                hover:bg-blue-500 disabled:opacity-50
              "
            >
              Send
            </button>

            <button
              onClick={unsubscribeFromPush}
              className="
                rounded-lg border border-red-600/50 px-4 py-2
                text-sm font-medium text-red-400 hover:bg-red-600/10
              "
            >
              Disable
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600/20 text-yellow-400">
              🔕
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-400">
                Notifications disabled
              </p>
              <p className="text-xs text-gray-400">
                Enable to stay updated
              </p>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={subscribeToPush}
            className="
              w-full sm:w-auto rounded-lg bg-green-600 px-6 py-2
              text-sm font-medium text-white hover:bg-green-500
            "
          >
            Enable Notifications
          </button>
        </div>
      )}
    </div>
  </div>
)


}

export default PushNotificationManager