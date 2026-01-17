/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
 
  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )
 
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])
 
  if (isStandalone || !isIOS) {
    return null
  }

  return (
    <div
      className="
        fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md
        rounded-xl border border-gray-700 bg-[#121212]
        p-4 shadow-lg
      "
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          📱
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white">
            Install this app
          </h4>

          <p className="mt-1 text-xs text-gray-400 leading-relaxed">
            Tap the{" "}
            <span className="font-medium text-gray-200">
              Share
            </span>{" "}
            button <span>⬆️</span> and select{" "}
            <span className="font-medium text-gray-200">
              Add to Home Screen
            </span>{" "}
            <span>➕</span>
          </p>
        </div>
      </div>
    </div>
  )
}


 
export default InstallPrompt